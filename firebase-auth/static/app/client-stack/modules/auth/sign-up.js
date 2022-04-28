import {Plugster} from 'https://cdn.jsdelivr.net/gh/paranoid-software/plugster@1.0.12/dist/plugster.min.js';
import {firebaseConfig} from "./config.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

class SignUpPlugster extends Plugster {

    constructor(outlets) {

        super(outlets);
        const firebaseApp = initializeApp(firebaseConfig);
        this.auth = getAuth(firebaseApp);

    }

    afterInit() {

        let self = this;

        self._.signUpButton.click(() => {
            self.handleSignUp();
        });

    }

    isValidEmail(email) {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    handleSignUp() {
        let self = this;
        let email = self._.emailInput.val();
        let pwd = self._.passwordInput.val();

        if (!self.isValidEmail(email)) {
            self._.emailInput.addClass('is-danger');
            self._.emailInput[0].parentElement.nextElementSibling.classList.remove('hidden');
            return;
        }
        else {
            self._.emailInput.removeClass('is-danger');
            self._.emailInput[0].parentElement.nextElementSibling.classList.add('hidden');
        }

        if (!pwd) {
            self._.passwordInput.addClass('is-danger');
            self._.passwordInput[0].parentElement.nextElementSibling.classList.remove('hidden');
            return;
        }
        else {
            self._.passwordInput.removeClass('is-danger');
            self._.passwordInput[0].parentElement.nextElementSibling.classList.add('hidden');
        }
        createUserWithEmailAndPassword(self.auth, email, pwd).then((credential) => {
            sendEmailVerification(credential.user).then((response) => {
                console.log(response);
            }).catch((reason) => {
                console.log(reason);
            });
        }).catch((reason) => {
            console.log(reason);
        });
        return;
            window.bulmaToast.toast({
                message: 'Hello There', position: "top-center",
                type: 'is-danger',
                dismissible: true,
                animate: {in: 'fadeIn', out: 'fadeOut'},
            });
        signInWithEmailAndPassword(self.auth, self._.emailInput.val(), self._.passwordInput.val()).then((credential) => {
            $.ajax({
                url: '/auth/identity/',
                type: 'POST',
                data: JSON.stringify(credential),
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                headers: {
                    'X-Gateway-Token': self._.gatewayTokenHiddenInput.val()
                }
            }).done(() => {
                let queryStringMap = {};
                window.location.search.substr(1).split('&').forEach(function (q) {
                    let parts = q.split('=');
                    if (parts.length !== 2) return;
                    queryStringMap[parts[0].toString()] = parts[1].toString();
                });
                let queryString = '';
                if ('draft' in queryStringMap) {
                    queryString = 'draft=1';
                }
                window.location.replace(`/${self._.langCodeHiddentInput.val()}?${queryString}`);
            });
        }).catch((reason) => {
            console.log(reason);
        });
    }

}

let signUpPlugster = await new SignUpPlugster({
    langCodeHiddentInput: {},
    gatewayTokenHiddenInput: {},
    emailInput: {},
    passwordInput: {},
    signUpButton: {}
}).init();

Plugster.plug(signUpPlugster);
