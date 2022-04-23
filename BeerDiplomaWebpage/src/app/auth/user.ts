/*
export class User{
    //public userName: String = '';
    //public password: String = '';
    //public password2: String = '';
    //public email: String= '';
    public name: String='';
    public style: String='';
    public brewery: String='';
    public abv: String='';
    public ibu: String='';
    public img: String='';

    constructor() { }

}
*/

export interface User{
    login: String;
    password: String;
    }

export interface UserInfo{
    email: String;
    login: String;
    password: String;
}
