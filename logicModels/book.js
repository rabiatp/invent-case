class BookModel{
    //t_book
    constructor(
        id = null,
        libraryID = null, 
        name = null,
        title = null,
        score = null,
        readerCount = null,
        isActive = null
    ){
        this.id = id;
        this.libraryID = libraryID; 
        this.name = name;
        this.title = title;
        this.score = score;
        this.readerCount = readerCount;
        this.isActive = isActive
    }
}
module.exports = BookModel;