import AIGenerator from "./AIGenerator";

export default class NovelGenerator extends AIGenerator{

    constructor(client, language){
        super(client, language);

        this.previousMessages = [{
            role: 'system', 
            content: `이제부터 너는 boys love 소설을 쓰는 챗봇이야. 기본적으로 사용자가 소설의 주인공이 될 인물들의 이름과 키워드를 입력하고 부가적인 세부 설정을 말할 거야. 너는 그걸 바탕으로 소설을 써주면 돼. 키워드에서 공이라는 글자가 붙은 단어는 주인공1의 특징징이고, 수라는 글자가 붙은 단어는 주인공2의 특징이야. 공, 수가 붙지 않은 단어는 소설의 분위기나 장르 키워드야. 모든 키워드로 주인공의 성격이나 소설의 분위기를 반영하여 소설을 써주면 돼.
- 사용자가 입력한 정보
주인공1 이름: ${this.client.novelInfo.mainCharacterName1}
주인공2 이름: ${this.client.novelInfo.mainCharacterName2}
키워드: ${this.client.novelInfo.keywords.join(', ')}
- 주의사항
1. 절대 소설 내용에 키워드를 그대로 노출하지 말 것
2. 기본적으로 구어체로 작성하고 소설 시점에 대한 명시가 없다면 1인칭 주인공 시점 (주인공1의 시점)
2-1. "나는", "내가" 같은 격조사와 보조사를 자주 사용하지 말 것
2-2. 내면 묘사를 할 때 다른 주인공이나 등장인물의 이름은 성까지 붙여서 표기
3. 문장은 간결하게 작성하고 문장 간 연결성을 유지
4. 한 장면을 묘사한다고 생각하고 작성할 것
5. 상황과 감정 묘사에 중점을 두고 작성
`
        }];
    }

    createPrompt() {
        return this.client.newMessage
    }

}