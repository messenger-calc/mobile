export type RootStackParamList = {
    Calculator: { setChat: (isStart: boolean) => void };
    Chat: undefined;
}

export type ChatStackParamList = {
    Home: undefined;
    Chat: undefined;
    Call: undefined;
    Calling: undefined;
}