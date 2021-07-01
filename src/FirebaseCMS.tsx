import React, {useContext, useEffect, useState} from "react";

import {
    Authenticator,
    CMSAppProvider,
    NavigationBuilder,
    NavigationBuilderProps,
    useAuthContext,
    useSideEntityController
} from "@camberi/firecms";

import "typeface-rubik";
import buildSubscriptionCollection from "./collections/subscriptions";
import buildUserCollection from "./collections/user";
import buildResourceCollection from "./collections/resource";
import buildResourceTypeCollection from "./collections/resource_types";
import buildTopicCollection from "./collections/topic";
import buildStateCollection from "./collections/state";
import buildStakeholderCollection from "./collections/stakeholder";
import buildRallyCollection from "./collections/rally";
import buildPartyCollection from "./collections/party";
import buildOfficialCollection from "./collections/official";
import buildMeetingTypeCollection from "./collections/meeting_types";
import buildCityCollection from "./collections/city";
import buildActionPlanCollection from "./collections/action_plan";
import wiseDemoCollection from "./collections/wise_demo";
import {Box, CircularProgress} from "@material-ui/core";
import firebase from "firebase/app";
import userContext from "./contexts/userContext";

const firebaseConfig = {
    apiKey: "AIzaSyAlMzICClI1d0VPAs5zGmyOO6JEUqLQAic",
    authDomain: "democraseeclub.firebaseapp.com",
    databaseURL: "https://democraseeclub.firebaseio.com",
    projectId: "democraseeclub",
    storageBucket: "democraseeclub.appspot.com",
    messagingSenderId: "1051506392090",
    appId: "1:1051506392090:web:721f69ed2b5afde2a4a5a3",
    measurementId: "G-XYVYDC8L1N",
};

interface FbUser {
    email: string,
    phoneNumber: string,
    displayName: string,
    website: string,
    bio: string,
    picture: string,
    coverPhoto: string,
    roles: Array<string>
}

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

export function withCmsHooks(PassedComponent: any) {
    return function WrappedComponent(props: object) {
        const sideEntityController = useSideEntityController();
        const authController = useAuthContext();
        return <PassedComponent {...props} sideEntityController={sideEntityController}
                                authController={authController}/>;
    }
}

const fbApp = firebase.initializeApp(firebaseConfig);

export function FirebaseCMS(props: any) {
    const navigation: NavigationBuilder = ({user}: NavigationBuilderProps) => {
        //console.log('navigation fb user: ', user, fbUser)
        const navItems = [];

        if (user?.isAnonymous === false) {
            navItems.push(
                buildResourceCollection(user, fbUser),
                buildRallyCollection(user, fbUser),
                buildActionPlanCollection(user, fbUser),

                buildMeetingTypeCollection(user, fbUser),
                buildSubscriptionCollection(user, fbUser),
                buildTopicCollection(user, fbUser),
                buildResourceTypeCollection(user, fbUser),
                buildStateCollection(user, fbUser),
                buildStakeholderCollection(user, fbUser),
                buildPartyCollection(user, fbUser),
                buildOfficialCollection(user, fbUser),
                buildCityCollection(user, fbUser),
                wiseDemoCollection(user, fbUser),

                buildUserCollection(user, fbUser)
            )
            if (fbUser?.roles.includes('editor')) {

                document.querySelector("body")?.classList.add("editor")

            } else if (fbUser?.roles.includes('admin')) {

                document.querySelector("body")?.classList.add("user")

            } else {

                document.querySelector("body")?.classList.add("user")
            }
        }
        // console.log(navItems);
        return {collections: navItems};
    };

    const myAuthenticator: Authenticator = async (user?: firebase.User) => {

        // console.info("Allowing access to", user?.toJSON());

        if (user) {
            let idToken = await user.getIdToken(true).then(idToken => idToken);
             // console.info("Sync with " + idToken, user.toJSON());

            if(!globalUser) {

                setUser(user)

            }

            console.log(user, "user firebaseCMS")
            await postData(process.env.REACT_APP_FUNCTIONS_URL + "/syncUser", {idToken})
                .then(data => {
                    if (!data) {
                        console.error("invalid sync request")
                    } else if (data.message) {
                        console.error(data.message);
                    } else {
                        console.log('setting firebase user: ', data);
                        setFbUser(data);
                    }

                    return data
                })
                .catch(e => console.error(e))

            return true;
        }
        return false;
    };

    if (!firebaseConfigInitialized) {
        return <Box display="flex" width={"100%"} height={"100vh"}>
            <Box m="auto">
                <CircularProgress/>
            </Box>
        </Box>
    }

    const {children, ...others} = props;

    return (
        <div className="cms-container">
            <CMSAppProvider
                authentication={myAuthenticator}
                signInOptions={[
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                ]}
                allowSkipLogin={false}
                navigation={navigation}
                firebaseConfig={firebaseConfig}
                {...others}
            >
                {props.children}
            </CMSAppProvider>
        </div>
    );
}

export default FirebaseCMS;
