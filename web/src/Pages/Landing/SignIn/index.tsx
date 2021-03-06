import { Box, VStack } from "@chakra-ui/layout";
import { useHistory } from "react-router-dom";
import { Alert, Button, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Magic } from "magic-sdk";
import { InputField } from "features";
import { loginUser } from "app/utils/api/user";
import {
  MAIGC_PK,
  MSG_REQ_ERR,
  RES_USER_MAGIC_LOGGED_IN,
  RES_USER_MAGIC_SIGNED_UP,
} from "app/constants";
import { SITE_PATHS } from "app/routes";

interface SignInFormVals {
  email: string;
}

const initialValues: SignInFormVals = {
  email: "",
};

function validateEmail(value: string) {
  let error;
  var re = /\S+@\S+\.\S+/;
  if (!re.test(value)) {
    error = "You should enter a valid email";
  }
  return error;
}

const magic = new Magic(MAIGC_PK);

function SignIn() {
  const history = useHistory();
  const [submitErr, setSubmitErr] = useState(false);
  const [initialCheckOn, setInitialCheckOn] = useState(true);

  useEffect(() => {
    async function checkLoginStatus() {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        const didToken = await magic.user.getIdToken();
        const message = await loginUser(didToken);
        if (message === RES_USER_MAGIC_LOGGED_IN) {
          history.push(SITE_PATHS.HOME);
        } else if (message === RES_USER_MAGIC_SIGNED_UP) {
          history.push(SITE_PATHS.SIGN_UP);
        }
      }
      setInitialCheckOn(false);
    }
    checkLoginStatus();
  }, []);

  return (
    <Box
      w={["2xs", null, "sm"]}
      py={6}
      px={[4, null, 8]}
      rounded={40}
      bg="white"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={async (values: SignInFormVals, actions) => {
          const email = values.email;
          const didToken = await magic.auth.loginWithMagicLink({ email });
          const message = await loginUser(didToken);
          if (message === RES_USER_MAGIC_LOGGED_IN) {
            history.push(SITE_PATHS.HOME);
          } else if (message === RES_USER_MAGIC_SIGNED_UP) {
            history.push(SITE_PATHS.SIGN_UP);
          } else {
            setSubmitErr(true);
          }
          actions.setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <VStack flexFlow="column" alignItems="center" spacing={3}>
              <Text fontSize={["xl", null, "3xl"]} fontWeight="bold" pb={2}>
                Sign In
              </Text>
              <Text fontSize={{ base: "md", lg: "xl" }} textAlign="center">
                Or SignIn/SignUp to create a new transfer.
              </Text>
              <InputField
                name="email"
                placeholder="Enter your email"
                fontSize={{ base: "md", lg: "xl" }}
                validate={validateEmail}
              />
              {submitErr && (
                <Alert status="error" textAlign="center">
                  {MSG_REQ_ERR}
                </Alert>
              )}
              <Button type="submit" isLoading={isSubmitting || initialCheckOn}>
                Submit
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}

export default SignIn;
