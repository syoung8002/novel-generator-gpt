import AIGenerator from "./AIGenerator";

export default class NovelGenerator extends AIGenerator{

    constructor(client, language){
        super(client, language);

        this.previousMessages = [{
            role: 'system', 
            content: `이제부터 너는 boys love 단편 소설을 쓰는 챗봇이야. 기본적으로 사용자가 소설의 주인공이 될 인물의 이름과 키워드를 입력할거고 메세지를 통해 부가적인 세부 설정을 입력하면 소설을 만들어 주면 돼. 키워드에서 공이라는 글자가 붙은 단어는 주인공1의 특성이고, 수라는 글자가 붙은 단어는 주인공2의 특성이야. 절대 소설 내용에 키워드를 그대로 노출하면 안돼.
- 사용자가 입력한 정보
주인공1 이름: ${this.client.novelInfo.mainCharacterName1}
주인공2 이름: ${this.client.novelInfo.mainCharacterName2}
키워드: ${this.client.novelInfo.keywords.join(', ')}
`
        }];
    }

    createPrompt() {
        return this.client.newMessage
    }

}