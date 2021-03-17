export interface GrayLiterature {
    id?: String;
    type?: Number;
    articleURL?: String;
    authorlist?: Array<{
        firstName?: String;
        lastName?: String;
    }>;
    authors?: String;
    doi?: String;
    handle?: String;    
    isOpenAccess?: Boolean;
    phase: {
        name: String;
        year: Number;
    };
    title?: String;    
    year?: Number;
    accepted?: Boolean;
}
