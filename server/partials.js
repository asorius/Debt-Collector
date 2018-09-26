const login_template = `
<div class="login_container">
    <button class='back'>back</button>
    <form class="loginForm">
        <label for="collection_name">Account Name:</label>
        <input type="text" id="collection_name">
        <label for="collection_pass">Password:</label>
        <input type="password" name="collection_pass" id="collection_pass">
        <button class='connectBtn'>Connect to Account</button>
    </form>
</div>`;

const new_collection_template = `<div class="form form_create">
    <button class='back'>back</button>
    <form action="" class="create">
        <label for="collection_name">Account Name:</label>
        <input type="text" id="collection_name" placeholder='Min 4 characters..' autocomplete='off'>
        <label for="collection_pass">User Password:</label>
        <input type="password" name="collection_pass" id="collection_pass" placeholder='Min 4 characters..'>
        <label for="collection_pass__admin" >Admin Password:</label>
        <input type="password" name="collection_pass__admin" id="collection_pass__admin" placeholder='Min 4 characters..'>
        <button class='createBtn'>Create</button>
    </form>
</div>`;

const data_page_overall_template_admin = `
<div class='data_template__container'>
    <h1 id='accName'>{{name}}'s account</h1>
    <div class="main_data__inputs">
        <input class='ain' type="text" placeholder='Amount' autocomplete='off'>
        <input class='din' type="text" placeholder='Details' autocomplete='off'>
        <button class="add">Submit</button>
    </div>
    <div class="main_data">        </div>
    <div class='opts'>
    <div class='sumDiv'><h3>In total: {{sum}} &#163;.</h3></div>
        <button class='logout'>Logout</button> 
        <button class='deleteSingles'>Delete All</button> 
        <button class='deleteAll'>Delete Account</button>            
    </div>
</div>`;

const single_add_template_admin = `
<div class="main_data__single">
    <input class='val adm_in' type="text" value='{{amount}}' disabled>
    <input class='dtls adm_in' type='text' value='{{details}}' disabled>
    <div class="time adm_div">{{time}}</div>
    <div class='edited adm_div'>{{edited}}</div>
    <button class='edit'>Edit</button>
    <button class='delete'>Delete</button>
</div>`;

const data_page_overall_template_user = `
<div class='data_template__container_user'>
    <h1 id='accName'>{{name}}'s account</h1>
    <div class="main_data"></div>
    <div class='sumDiv'><h3>In total: {{sum}} &#163;.</h3></div>
    <button class='logout'>Logout</button>            
</div>`;

const single_add_template = `
<div class="main_data__single_user">
    <div class='val user_div'><span class='amountVal'>{{amount}}</span> <span>&#163;</span>. <span class='detVal'>{{details}}</span>.</div>
    <div class="time user_div">At {{time}}.</div>
    <div class='edited user_div'>{{edited}}</div>
</div>`;

const global = {
  new_collection_template,
  login_template
};
const user = {
  data_page_overall_template_user,
  single_add_template
};
const admin = {
  data_page_overall_template_admin,
  single_add_template_admin
};
module.exports = {
  global,
  user,
  admin
};
