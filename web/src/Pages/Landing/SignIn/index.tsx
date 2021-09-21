import { Box, VStack } from "@chakra-ui/layout";
import { useHistory } from "react-router-dom";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik } from "formik";
import { useEffect } from "react";
import { Magic } from "magic-sdk";

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

const magic = new Magic("pk_live_9CECDC3B1BA34ADB");

function SignIn() {
  const history = useHistory();

  useEffect(() => {
    async function checkLoginStatus() {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        history.push("/home");
      }
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
          await magic.auth.loginWithMagicLink({ email });
          actions.setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <VStack flexFlow="column" alignItems="center" spacing={3}>
              <Text fontSize={["xl", null, "3xl"]} fontWeight="bold" pb={2}>
                Sign In
              </Text>
              <Text fontSize={["md", null, "xl"]} textAlign="center">
                Or Sign In to create a new transfer.
              </Text>
              <Field name="email" validate={validateEmail}>
                {({ field, form }: FieldProps) => (
                  <FormControl
                    isInvalid={form.touched.email && !!form.errors.email}
                  >
                    <Input
                      {...field}
                      fontSize={["md", null, "xl"]}
                      id="email"
                      placeholder="Enter your email"
                    />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Button type="submit" isLoading={isSubmitting}>
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
