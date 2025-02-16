<template>
    <v-container>
        <v-card flat>
            <v-card-title>
                <v-switch
                    v-model="isEdited"
                    label="기본 정보 입력"
                    color="primary"
                ></v-switch>
            </v-card-title>
            <v-card-text v-if="isEdited">
                <v-text-field
                    label="공 이름"
                    v-model="novelInfo.mainCharacterName1"
                ></v-text-field>
                <v-text-field
                    label="수 이름"
                    v-model="novelInfo.mainCharacterName2"
                ></v-text-field>

                <v-combobox
                    v-model="novelInfo.keywords"
                    :items="novelInfo.keywords"
                    label="키워드"
                    chips
                    hide-selected
                    multiple
                >
                    <template v-slot:chip="{ item }">
                        <v-chip :key="item.id" :text="item.text" color="primary" closable></v-chip>
                    </template>
                </v-combobox>
            </v-card-text>
        </v-card>

        <div class="d-flex mb-2">
            <v-checkbox
                v-model="isSelectedAll"
                label="전체 선택"
                class="mr-3"
                @click="toggleSelectAll"
            ></v-checkbox>
            <v-btn 
                variant="flat"
                density="comfortable"
                :disabled="selectedMessages.length === 0"
                @click="downloadNovel" 
                prepend-icon="mdi-download"
                class="mt-3"
            >
                다운로드
            </v-btn>
        </div>

        <div>
            <div v-for="(message, index) in messages" :key="index" class="mb-2">
                <v-card v-if="message.role === 'user'"
                    class="ml-auto pa-3"
                    color="info"
                    max-width="500"
                >
                    <div v-html="formatMessageContent(message.content)" class="message-content"></div>
                </v-card>
                <div v-else class="d-flex">
                    <v-checkbox
                        v-if="selectedMessages.length > 0"
                        v-model="selectedMessages"
                        :value="message"
                        :input-value="selectedMessages.some(selected => selected.id === message.id)"
                        @change="toggleMessageSelection(message)"
                    ></v-checkbox>
                    <v-card
                        class="mr-auto pa-3"
                        color="lightgrey"
                        max-width="800"
                    >
                        <v-avatar left size="32">
                            <v-icon>mdi-robot</v-icon>
                        </v-avatar>
                        <div v-html="formatMessageContent(message.content)" class="message-content"></div>
                        <v-progress-linear 
                            v-if="message.isGenerating"
                            indeterminate 
                            color="primary"
                        ></v-progress-linear>
                    </v-card>
                </div>
            </div>

            <v-card class="ml-auto mb-2 px-3"
                color="info"
                max-width="500"
            >
                <v-textarea
                    v-model="content"
                    placeholder="내용 입력 (줄바꿈은 ctrl + enter)"
                    rows="1"
                    auto-grow
                    @keydown="handleKeydown"
                >
                    <template v-slot:append-inner>
                        <v-icon size="20" @click="generateNovel">mdi-send</v-icon>
                    </template>
                </v-textarea>
            </v-card>
        </div>
    </v-container>
</template>

<script>
import NovelGenerator from './untils/NovelGenerator';

export default {
    name: 'NovelChat',
    data() {
        return {
            novelGenerator: null,
            isEdited: true,
            messages: [],
            content: '',
            novelInfo: {
                mainCharacterName1: '',
                mainCharacterName2: '',
                keywords: [
                    '연하공',
                    '다정공',
                    '연상수',
                    '능력수',
                ],
            },
            isSelectedAll: false,
            selectedMessages: [],
        }
    },
    watch: {
        isSelectedAll(newVal) {
            if (newVal) {
                this.selectedMessages = this.messages.filter(message => message.role !== 'user');
            }
        },
        selectedMessages(newVal) {
            const allMessages = this.messages.filter(message => message.role !== 'user');
            if (newVal.length === allMessages.length) {
                this.isSelectedAll = true;
            }
        }
    },
    mounted() {
        this.novelGenerator = new NovelGenerator(this, {
            isStream: true,
            preferredLanguage: 'Korean'
        });
    },
    methods: {
        uuid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        },
        handleKeydown(event) {
            if (event.key === 'Enter' && !event.ctrlKey) {
                event.preventDefault();
                this.generateNovel();
            } else if (event.key === 'Enter' && event.ctrlKey) {
                this.content += '\n';
            }
        },
        async generateNovel() {
            this.messages.push({
                id: this.uuid(),
                role: 'user',
                content: this.content,
                timestamp: new Date().toISOString()
            });

            const messages = this.messages.map(message => ({
                role: message.role,
                content: message.content
            }));
            this.novelGenerator.previousMessages = [this.novelGenerator.previousMessages[0], ...messages];
            await this.novelGenerator.generate();
            
            this.messages.push({
                id: this.uuid(),
                role: 'system',
                content: '...',
                isGenerating: true,
                timestamp: new Date().toISOString()
            });
            this.content = '';
        },
        onModelCreated(response) {
            const lastMessage = this.messages.find(message => message.role === 'system' && message.isGenerating);
            if (lastMessage) {
                lastMessage.content = response;
            }
        },
        onGenerationFinished(response) {
            const lastMessage = this.messages.find(message => message.role === 'system' && message.isGenerating);
            if (lastMessage) {
                lastMessage.content = response;
                lastMessage.isGenerating = false;
            }
        },
        formatMessageContent(content) {
            return content.replace(/\n/g, '<br>');
        },
        toggleSelectAll() {
            this.isSelectedAll = !this.isSelectedAll;
            if (this.isSelectedAll) {
                this.selectedMessages = this.messages.filter(message => message.role !== 'user');
            } else {
                this.selectedMessages = [];
            }
        },
        toggleMessageSelection(message) {
            const messages = this.messages.filter(message => message.role !== 'user');
            if (this.selectedMessages.length > 0 && this.selectedMessages.length !== messages.length) {
                this.isSelectedAll = false;
            }
        },
        downloadNovel() {
            const content = this.selectedMessages.map(message => message.content).join('\n\n');
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'novel.txt';
            a.click();
            URL.revokeObjectURL(url);
        }
    }
}
</script>

<style scoped>
.message-content {
    white-space: pre-wrap;
}
</style>