export default class SocketCommandManager {
    // General CMD
    public static DISCONNECT_LOGIN_CONFLICT: number = -2;
    public static SESSION_TIME_OUT: number = -9;
    public static RECONNECT: number = -15;
    public static LOGIN: number = 0;
    public static LOAD_LOGIN_DATA: number = 1;
    public static LOGIN_CONFLICT: number = 2;
    public static BROADCAST: number = 3;
    public static SET_LANGUAGE: number = 4;
    public static EVENT_CLAIM: number = 5;
    public static NOTI_IN_LOBBY: number = 6;
    public static GET_LIST_HIDDEN_ROOM: number = 11;
    public static JOIN_HIDDEN_ROOM: number = 12;
    public static PLAYER_JOIN_TABLE: number = 13;
    public static GET_INFO_JOIN_TABLE: number = 14;
    public static USER_JOIN_TABLE: number = 15;
    public static PLAYER_LEAVE_TABLE: number = 16;
    public static QUICK_PLAY: number = 17;
    public static GET_JACKPOT: number = 18;
    public static IN_GAME_CHAT: number = 19;
    public static GET_FISH_RATIO: number = 21;
    public static TIME_AUTO_START_BATTLE: number = 30;
    public static START_GAME_BATTLE: number = 31;
    public static GAME_OVER_BATTLE: number = 32;
    public static ONLINE_GIFT: number = 89;
    public static CLAIM_ONLINE_GIFT: number = 90;
    public static RECEIVE_BONUS_REGISTER: number = -4;


    // Play Fish CMD
    public static CMD_FISH_GAME: number = 20;
    public static ADD_FISH: number = 0;
    public static USER_FIRE: number = 1;
    public static HIT_FISH: number = 2;
    public static HIT_GROUP_FISH: number = 3;
    public static CAN_KILL_SKILLFISH: number = 4;
    public static KILL_FISH: number = 5;
    public static KILL_GROUP_FISH: number = 6;
    public static CHANGE_GUN: number = 7;
    public static FREEZE_SKILL: number = 8;
    public static INIT_SKILL: number = 9;    // laze và đinh ba
    public static FIRE_SKILL: number = 10;     // laze và đinh ba
    public static UPDATE_PLAYER_FISH: number = 11;     // các skill, arr Gun, curGun
    public static USE_SKILL_SUMMON: number = 12;
    public static USE_SKILL_FREEZE: number = 13;
    public static USE_SKILL_SPEED: number = 14;
    public static USE_SKILL_TARGET: number = 26;
    public static USE_SKILL_BY_MONEY: number = 27;
    public static SUMMON_FISH: number = 15;
    public static USER_X2SPEED: number = 16;
    public static GET_ITEM: number = 17;
    public static HIT_JACKPOT: number = 18;
    public static HIT_THANTAI: number = 19;
    public static ROTATE_MINIGAME_WHEEL: number = 20;
    public static JOIN_MINIGAME_COFFER: number = 21;
    public static END_MINIGAME_COFFER: number = 22;
    public static ADD_FISH_TRACE: number = 25;
    public static PLAYER_MOVE: number = 27;
    public static GUN_ABILITY: number = 28;
    public static HIT_FISH_WITH_ABILITY: number = 29;
    public static KILL_FISH_ARENA: number = 30;
    public static PLAYER_RESPAWN: number = 32;
    public static SHOW_POPUP_INFO: number = 81;
    public static UPDATE_MONEY: number = 88;
    public static HIT_PLAYER_ARENA: number = 31;
    public static HIT_FISH_ARENA: number = 33;
    public static KILL_PLAYER_ARENA: number = 34;
    public static PING_KEEP_CONNECTION = 122;
    public static PING_SERVER: number = 120;
    public static PING_WIFI: number = 123;
    public static LIST_FISH_LIFE: number = 35;

    // request sv slot
    public static REQUEST_SLOT_SERVER: number = 50;
    public static CMD_SLOT: number = 51;

    //Roulette
    public static CMD_ROULETTE: number = 72;
    public static CMD_MAYBAY: number = 73;

    //HYDRA - KARAKEN
    public static SUMMON_HYDRA = 28; // summon jackpot
    public static HIT_HYDRA = 29; // hit jackpot
    public static KILL_HYDRA = 30; // hit jackpot
    public static ARMOR_HYDRA = 31; // armor jackpot

    public static CMD_POKER_MEGA: number = 74;
    public static CMD_POKER_MEGA_SG: number = -77;
    public static CMD_TX_LIVE: number = 76;
    public static CMD_XD_LIVE: number = 77;
    public static CMD_LO_DE_SIEU_TOC: number = 75;
    public static CMD_XD_88_LIVE: number = -66;
    public static CMD_TX_789_LIVE: number = -69;
    public static CMD_XD_789_LIVE: number = -73;
    public static CMD_XD_KUBET_LIVE: number = -74;
    public static CMD_BACCARAT_LIVE: number = -75;
    public static CMD_SICBO_KUBET_LIVE: number = -76;

    //MINI GAMES
    public static CMD_TAIXIUHIT_MINI_LIVE = -70;
    public static SHOW_RESULT_TX_MINI = 80;
    public static UPDATE_BET_TX_MINI = 82;
    public static UPDATE_BET_TX_MINI_MD5 = 83;
    public static UPDATE_BET_TX_MINI_JP = 84;
    public static UPDATE_BET_TX_MINI_LIVE = 85;


    public static CMD_MINI_SLOT = 92;
    public static CMD_TAIXIU_MINI = 101;
    public static CMD_POKER_MINI = 102;
    public static CMD_UPDOWN_MINI = 103;

    public static CMD_TAIXIU_MINI_MD5 = 104;
    // public static CMD_TAIXIU_MINI_JP = 109;
    public static CMD_TAIXIU_MINI_LIVE = 110;

    public static CMD_MINI_JOINGAME = 0;
    public static CMD_MINI_STARTGAME = 1;
    public static CMD_MINI_BETGOLD = 2;
    public static CMD_MINI_UPDATEMONEY = 3;
    public static CMD_MINI_GAMEOVER = 4;
    public static CMD_MINI_SHAKE_DICE = 5;
    public static CMD_MINI_UPDATE_BET = 6;
    public static CMD_MINI_LEAVEGAME = 7;
    public static CMD_MINI_RETURN_BALANCE = 8;
    public static CMD_MINI_STATISTIC = 9;
    //CMD_MINI_USER_HISTORY = 10,
    public static CMD_MINI_CHAT = 11;
    public static CMD_MINI_ONE_DEAL_CARD_BACCARAT = 12;
    public static CMD_MINI_HISTORY_CHAT = 13;
    public static CMD_MINI_MD5 = 14;
    public static CMD_MINI_UPDATE_JACKPOT = 19;
    public static CMD_MINI_WIN_JACKPOT = 20;
    public static CMD_MINI_NEW_ROUND = 21;
    public static MINI_CHOSEN_LINE_SLOT = 22;
}

