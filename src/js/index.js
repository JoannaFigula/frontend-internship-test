/* Here goes your JS code */
let $main;
let $clickMeBtn;
let $popup;
let $closePopup;
let $submitBtn;
let $finalMessage;

const main = () => {
    prepareDomElements();
    prepareDomEvents();
}

class Popup {
    constructor(selector, closeSelector) {
        this.root = document.querySelector(selector);
        this.closeSelector = closeSelector;
        this.close = this.close.bind(this);
    }

    initEvents() {
        this.root.querySelector(this.closeSelector).addEventListener('click', this.close)
    }

    close() {
        this.root.innerHTML = '';
        this.root.style.display = "none";
    }

    open(content) {
        this.root.style.display = "flex";
        this.root.appendChild(content);
        this.initEvents();
    }
}

class Form {
    constructor(successAction) {
        this.init();
        this.errors = [];
        this.successAction = successAction;
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validatePassword(password) {
        const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(password);

        // (/^
        // (?=.*\d)                //should contain at least one digit
        // (?=.*[a-z])             //should contain at least one lower case
        // (?=.*[A-Z])             //should contain at least one upper case
        // [a-zA-Z0-9]{6,}         //should contain at least 8 from the mentioned characters
        //
        // $/)
    }

    handleSubmit(e) {
        e.preventDefault();
        this.cleanError()
       if (!this.validateEmail(e.target.email.value)) {
           this.errors.push('Please enter a valid email')
       }

       if(!this.validatePassword(e.target.password.value)){
           this.errors.push('Please enter a valid password')
       }

       if(!e.target.agree.checked) {
           this.errors.push('Accept the terms & conditions')
       }

       if (this.errors.length) {
           this.update();
           return;
       }

       this.successAction();

    }

    cleanError() {
        this.errElement.innerHTML = '';
        this.errors = [];
    }

    update() {
        this.errors.forEach(error => {
            const p = document.createElement('p');
            p.innerHTML = error;
            this.errElement.appendChild(p);
        })
    }

    initEvent() {
        this.form.querySelector('form').addEventListener('submit', (e) => this.handleSubmit(e))
    }

    init() {
        this.form = document.createElement('div');
        this.form.innerHTML = `
            <h2>Login</h2>
            <button id="close-popup-form" ><i class="fas fa-times-circle"></i></button>
            
            <form>
                <input name="email" placeholder="E-mail"/>
                <input name="password" type="password" placeholder="Password"/>
                <label class="checkbox">
                    <input name="agree" type="checkbox" />
                    <span>I agree to terms & conditions.</span>
                </label>
                <div class="errors"></div>
                <button type="submit" class="submit-btn">Submit</button>                
            </form>
        `

        this.initEvent();
        this.errElement = this.form.querySelector('.errors');
    }

    getNode() {
        return this.form
    }
}

const prepareDomElements = () => {
    $main = document.querySelector('.main');
    $clickMeBtn = document.querySelector('#show-popup-form');
    $popup = document.querySelector('.popup');
    $closePopup = document.querySelector('#close-popup-form');
    $submitBtn = document.querySelector('.submit-btn');
    $finalMessage = document.querySelector('.final-message');
}

const prepareDomEvents = () => {
    $clickMeBtn.addEventListener('click', showPopup);
}

const submitPopup = () => {
    setTimeout(()=>{
        const finalMessage = document.createElement('p');
        finalMessage.classList.add('success-message');
        finalMessage.innerHTML = "Thank you!";
        $main.appendChild(finalMessage);
        $clickMeBtn.style.display='none';
        $popup.style.display='none';
    },3000);
}

const showPopup = () => {
    const popup = new Popup('.popup', '#close-popup-form');
    popup.open(new Form(submitPopup).getNode())
}

document.addEventListener('DOMContentLoaded', main);
