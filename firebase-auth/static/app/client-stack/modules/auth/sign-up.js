import {Plugster} from 'https://cdn.jsdelivr.net/gh/paranoid-software/plugster@1.0.12/dist/plugster.min.js';
import {firebaseConfig} from "./config.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

class SignUpPlugster extends Plugster {

    constructor(outlets) {

        super(outlets);
        const firebaseApp = initializeApp(firebaseConfig);
        this.auth = getAuth(firebaseApp);
        this.setLocales({
           es: {
               'Email already in use.': 'Correo electrónico no disponible.'
           }
        });
    }

    afterInit() {

        let self = this;

        self._.emailInput.on('blur keyup', {}, (e) => {
            if (self.isValidEmail(e.target.value) && self._.passwordInput.val()) {
                self._.signUpButton.removeAttr('disabled');
                self._.signUpButton.off('click').click(() => { self.handleSignUp(); });
                return
            }
            self._.signUpButton.attr('disabled', '');
        });

        self._.passwordInput.on('blur keyup', {}, (e) => {
            if (e.target.value && self.isValidEmail(self._.emailInput.val())) {
                self._.signUpButton.removeAttr('disabled');
                self._.signUpButton.off('click').click(() => { self.handleSignUp(); });
                return
            }
            self._.signUpButton.attr('disabled', '');
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

        if (!self.isValidEmail(email) || !pwd) {
            return;
        }

        self._.signUpButton.addClass('is-loading');
        createUserWithEmailAndPassword(self.auth, email, pwd).then((credential) => {
            self.setIdentity(credential);
        }).catch((reason) => {
            self._.signUpButton.removeClass('is-loading');
            if (reason.code === 'auth/email-already-in-use') {
                window.bulmaToast.toast({
                    message: self.translateTo(self._.langCodeHiddentInput.val(), 'Email already in use.'),
                    position: "top-center",
                    type: 'is-danger',
                    dismissible: true,
                    duration: 4000,
                    animate: {in: 'fadeIn', out: 'fadeOut'},
                });
            }
        });
    }

    setIdentity(credential) {
        let self = this;
        // noinspection DuplicatedCode
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
        }).fail((reason) => {
            self._.signUpButton.removeClass('is-loading');
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
