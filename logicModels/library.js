class LibraryModel{
    //t_library
    constructor(
        id = null,
        name = null,
        bookID = null,
        userID = null,
    ){
        this.id = id;
        this.name = name;
        this.bookID = bookID;
        this.userID = userID;
    }
}
module.exports = LibraryModel;