interface profile {
    timestamp: bigint,
    profileId: string,
    profileName: string,
    textures: {
        SKIN : {
            url: string,
            metadata: {
                model: 'slim' | 'classic'
            }
        },
        CAPE?: {
            url: string
        }
    }
}

interface history {
    name: string,
    changedToAt: bigint
}

interface getSecurityQuestions {
    answer: { id: number },
    question: { id: number, question: string }
}

interface postSecurityQuestions {
    id: number,
    answer: string
}

interface Arr3<T> {
    0: T,
    1: T,
    2: T
}

export abstract class API {
    public constructor(APIToken?: string);
    private apiToken: string;

    public get securityQuestionsNeeded(): boolean | null;
    private get hasToken(): boolean;

    public usernameToUUID(username: string): string;
    public UUIDtoProfile(id: string): profile;
    public nameHistory(id: string): Array<history>;
    public getSecurityQuestions(): Arr3<getSecurityQuestions>;
    public sendSecurityQuestions(ans: Arr3<postSecurityQuestions>): void;

    private questionsNeeded(): boolean | null;
}