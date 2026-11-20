import { DifficultyLevel, OnlineRoomSession, TriviaRoomConfig } from '../types';

export type TriviaStackParamList = {
    TriviaHome: undefined;
    TriviaProgress: undefined;
    TriviaCatalog: {
        parentId?: string | null;
        mode?: 'explore' | 'picker';
    } | undefined;
    TriviaSoloGame: {
        themeId: string;
        difficulty: DifficultyLevel;
    };
    TriviaSoloResults: {
        themeId: string;
        difficulty: DifficultyLevel;
        score: number;
        total: number;
        answeredCount: number;
        duration: number;
        levelCompleted: boolean;
    };
    TriviaFriends: undefined;
    TriviaCreateRoom: {
        pickedThemeId?: string;
    } | undefined;
    TriviaJoinRoom: undefined;
    TriviaOnlineLobby: {
        session: OnlineRoomSession;
    };
    TriviaOnlineGame: {
        session: OnlineRoomSession;
    };
    TriviaRoomLobby: {
        roomConfig: TriviaRoomConfig;
    };
    TriviaTeamGame: {
        roomConfig: TriviaRoomConfig;
        previousSessionIds?: string[];
    };
};
