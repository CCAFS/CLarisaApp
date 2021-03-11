export interface Publication {
    id?: String;
    articleURL?: String;
    authorList?: Array<{
        firstName?: String;
        lastName?: String;
    }>;
    authors?: String;
    doi?: String;
    handle?: String;
    isISIJournal?: Boolean;
    isOpenAccess?: Boolean;
    issue?: String;
    journal?: String;
    npages?: String;
    phase: {
        name: String;
        year: Number;
    };
    title?: String;
    volume?: String;
    year?: Number;
}
