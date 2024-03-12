import BaseScene from "../Script/Core/BaseScene";
import Storage from "../Script/Storage/Storage";
import {getQueryParam} from "../Script/Utils/StringUtil";
import {GameConst} from "../Script/Const/GameConst";

const {ccclass, property} = cc._decorator;
cc.Enum(GameConst)

@ccclass('ListGame')
class ListGame {
    @property({type: GameConst})
    id: GameConst = GameConst.NO_GAME;
    @property(cc.Prefab)
    prefab: cc.Prefab = null;
}

@ccclass
export default class LobbyScene extends BaseScene {
    @property([ListGame])
    public listGame: ListGame[] = [];
    private gameScript: BaseScene = null;

    onLoad() {
        this.loadGameScene();
    }

    checkAuthOrLoginSocket() {
        if (!Storage.I().getAuth().isAuth) {
            const token = getQueryParam('token');
            this.gameScript.socket.sendMsgLogin({
                token
            }, (isSuccess, error) => {
                if (Storage.I().getAuth()) {
                    // this.loadGameScene();
                }
            })
        }
    }

    loadGameScene() {
        const gameId = getQueryParam('game');
        for (let i = 0; i < this.listGame.length; i++) {
            if (this.listGame[i].id === +gameId) {
                const gameNode = cc.instantiate(this.listGame[i].prefab);
                this.node.addChild(gameNode);
                this.gameScript = gameNode.getComponent(BaseScene);
                return;
            }
        }
    }
}
