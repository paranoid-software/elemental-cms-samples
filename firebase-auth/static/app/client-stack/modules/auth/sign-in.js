import {Plugster} from 'https://cdn.jsdelivr.net/gh/paranoid-software/plugster@1.0.12/dist/plugster.min.js';
import {firebaseConfig} from "./config.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

class SignInPlugster extends Plugster {

    constructor(outlets) {

        super(outlets);
        const firebaseApp = initializeApp(firebaseConfig);
        this.auth = getAuth(firebaseApp);

    }

    afterInit() {

        let self = this;

        self._.signInButton.click(() => {
           self.handleSignIn();
        });

    }

    handleSignIn() {
        let self = this;
        signInWithEmailAndPassword(self.auth, self._.emailInput.val(), self._.passwordInput.val()).then((credential) => {
            console.log(credential.user)
            $.ajax( {
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

let signInPlugster = await new SignInPlugster({
    langCodeHiddentInput: {},
    gatewayTokenHiddenInput: {},
    emailInput: {},
    passwordInput: {},
    signInButton: {}
}).init();

Plugster.plug(signInPlugster);
