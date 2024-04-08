class UserModel{
    //t_user
    constructor(
        id = null,
        libraryID = null, 
        name = null,
        surname = null,
        isActive = null,
    ){
        this.id = id;
        this.library_id = libraryID; 
        this.name = name;
        this.surname = surname;
        this.isActive = isActive;
    }
}
module.exports = UserModel;