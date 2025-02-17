import AIGenerator from "./AIGenerator";

export default class NovelGenerator extends AIGenerator{

    constructor(client, language){
        super(client, language);

        const mainCharacter1Name = this.client.novelInfo.mainCharacterName1;
        const mainCharacter2Name = this.client.novelInfo.mainCharacterName2;

        this.previousMessages = [{
            role: 'system', 
            content: `이제부터 너는 boys love 소설을 쓰는 챗봇이야. 사용자는 소설의 주인공이 될 인물들의 이름을 입력하고 보고싶은 장면이나 설정을 말할 거야. 너는 그걸 바탕으로 소설을 써주면 돼. 사용자가 말한 내용을 그대로 작성하지 말고 소설로 풀어서 써야 해. 사용자가 말한 내용 중 이해가 안가는 것이 있다면 적극적으로 그 정보를 찾아서 소설을 써야 해. 주인공1은 boys love 에서 공격 역할에 해당하고, 주인공2 는 수비 역할에 해당 하는 사람이야.
- 사용자가 입력한 정보
주인공1 이름: ${mainCharacter1Name}
주인공2 이름: ${mainCharacter2Name}
- 주의사항
1. 기본적으로 구어체로 작성하고 소설의 시점에 대한 명시가 없다면 1인칭 주인공 시점 (주인공1의 시점)
1-1. "나는", "내가" 같은 격조사와 보조사를 자주 사용하지 말 것
1-2. 내면 묘사를 할 때 다른 주인공이나 등장인물의 이름은 성까지 붙여서 표기
2. 문장은 간결하게 작성하고 문장 간 연결성을 유지할 것
3. 한 장면을 묘사한다고 생각하고 작성할 것
3-1. 상황과 감정 묘사에 중점을 두고 작성
4. 이전 대화 내용을 참고하여 회수되지 못한 떡밥이 존재하는 경우 그 떡밥을 풀어서 작성할 것
5. 주인공 이름은 절대 변경 금지
`
        }];
    }

    createPrompt() {
        return this.client.newMessage
    }

}