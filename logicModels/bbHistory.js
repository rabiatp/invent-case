class BbHistoryModel{
    //t_book
    constructor(
        id = null,
        userID = null,
        bookID = null,
        past = null,
        present = null
    ){
        this.id = id;
        this.userID = userID;
        this.bookID = bookID;
        this.past = past;
        this.present = present
    }
}
module.exports = BbHistoryModel;