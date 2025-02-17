<template>
    <v-container>
        <v-card flat>
            <v-list>
                <v-list-group>
                    <template v-slot:activator="{ props }">
                        <v-list-item v-bind="props" title="이전 내역"></v-list-item>
                    </template>
                    <v-list-item v-for="(item, index) in history" 
                        :key="index" 
                        @click="loadHistory(item)"
                    >
                        <v-list-item-title class="d-flex justify-space-between align-center">
                            <div class="d-flex align-center" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 70%;">
                                <v-icon class="mr-2">mdi-file-document-outline</v-icon>
                                {{ item }}
                            </div>
                            <v-btn icon="mdi-delete-outline" 
                                color="default" 
                                variant="text" 
                                density="comfortable" 
                                @click.stop="deleteHistory(item)"
                                class="ml-auto"
                            ></v-btn>
                        </v-list-item-title>
                    </v-list-item>
                </v-list-group>
            </v-list>

            <v-card-text>
                <v-text-field
                    label="공 이름"
                    v-model="novelInfo.mainCharacterName1"
                ></v-text-field>
                <v-text-field
                    label="수 이름"
                    v-model="novelInfo.mainCharacterName2"
                ></v-text-field>
            </v-card-text>
        </v-card>

        <div class="d-flex justify-end mb-2">
            <v-btn
                variant="text"
                density="comfortable"
                @click="init"
                prepend-icon="mdi-refresh"
            >
                초기화
            </v-btn>
        </div>
        
        <div class="d-flex">
            <v-checkbox
                v-model="isSelectedAll"
                label="전체 선택"
                class="mr-3"
                @click="toggleSelectAll"
            ></v-checkbox>
            <v-btn 
                variant="text"
                density="comfortable"
                :disabled="selectedMessages.length === 0"
                @click="saveNovel" 
                prepend-icon="mdi-file-document-outline"
                class="mt-3"
                color="success"
            >
                내역 저장
            </v-btn>
            <v-btn 
                variant="text"
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
            <div v-for="(message, index) in messages" :key="index" class="d-flex mb-10">
                <v-checkbox
                    v-if="selectedMessages.length > 0"
                    v-model="selectedMessages"
                    :value="message"
                    :input-value="selectedMessages.some(selected => selected.id === message.id)"
                    @change="toggleMessageSelection(message)"
                    min-width="36"
                ></v-checkbox>
                <v-card v-if="message.role === 'user'"
                    class="ml-auto pa-3"
                    color="info"
                    max-width="500"
                >
                    <div v-html="formatMessageContent(message.content)" class="message-content"></div>
                </v-card>
                <div v-else class="d-flex">
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
                    placeholder="내용 입력"
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
            },
            isSelectedAll: false,
            selectedMessages: [],
            isViewHistory: false,
            history: [],
        }
    },
    watch: {
        isSelectedAll(newVal) {
            if (newVal) {
                this.selectedMessages = this.messages;
            }
        },
        selectedMessages(newVal) {
            if (newVal.length > 0 && newVal.length === this.messages.length) {
                this.isSelectedAll = true;
            }
        },
    },
    mounted() {
        this.getHistory();
        this.novelGenerator = new NovelGenerator(this, {
            isStream: true,
            preferredLanguage: 'Korean'
        });
        this.openaiToken = localStorage.getItem('openAIToken');
        if (!this.openaiToken) {
            var apiKey = prompt('OpenAI API Key 입력');
            if(apiKey != '') {
                this.openaiToken = apiKey;
                window.localStorage.setItem('openAIToken', apiKey);
            }
        }
    },
    methods: {
        init() {
            this.messages = [];
            this.content = '';
            this.novelInfo = {
                mainCharacterName1: '',
                mainCharacterName2: '',
            };
            this.isSelectedAll = false;
            this.selectedMessages = [];
            this.novelGenerator = new NovelGenerator(this, {
                isStream: true,
                preferredLanguage: 'Korean'
            });
        },
        getHistory() {
            const history = localStorage.getItem('history');
            if (history) {
                this.history = JSON.parse(history);
            } else {
                this.history = [];
            }
        },
        loadHistory(item) {
            let novel = localStorage.getItem(item);
            if (novel) {
                novel = JSON.parse(novel);
                this.messages = novel.messages;
                this.novelInfo = novel.novelInfo;
            }
            this.isSelectedAll = false;
            this.selectedMessages = [];
        },
        deleteHistory(item) {
            this.history = this.history.filter(history => history !== item);
            localStorage.setItem('history', JSON.stringify(this.history));
            localStorage.removeItem(item);
            this.getHistory();
        },
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
            this.novelGenerator.setMainCharacterName(this.novelInfo.mainCharacterName1, this.novelInfo.mainCharacterName2);
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
                this.selectedMessages = this.messages;
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
        saveNovel() {
            try {
                const novelInfo = {
                    messages: this.selectedMessages,
                    novelInfo: this.novelInfo
                };
                const novelId = `${this.novelInfo.mainCharacterName1}_${this.novelInfo.mainCharacterName2}_${new Date().toISOString()}`;
                this.history.push(novelId);
                localStorage.setItem('history', JSON.stringify(this.history));
                localStorage.setItem(novelId, JSON.stringify(novelInfo));

                alert('저장되었습니다.');
            } catch (error) {
                alert('저장에 실패했습니다.');
            }
        },
        downloadNovel() {
            const downloadMessages = this.selectedMessages.filter(message => message.role !== 'user');
            const content = downloadMessages.map(message => message.content).join('\n\n');
            const base64Content = btoa(unescape(encodeURIComponent(content)));
            const a = document.createElement('a');
            a.href = `data:text/plain;base64,${base64Content}`;
            a.download = 'novel.txt';
            a.click();
        }
    }
}
</script>

<style scoped>
.message-content {
    white-space: pre-wrap;
}
</style>