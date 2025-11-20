import {
  InfisicalSDK,
  Secret,
  GetSecretResponse
} from '@infisical/sdk'

export function createSecretManagerClient(){
  return new InfisicalSDK({
    siteUrl: 'https://app.infisical.com',
  })
}

export async function getSecretValue(
  secretName:string
):Promise<Secret | null>{
  const client = createSecretManagerClient();
  try {
    await client.auth().universalAuth.login({
      clientId: process.env.INFISICAL_CLIENT_ID || "",
      clientSecret: process.env.INFISICAL_CLIENT_SECRET || "",
    });
  } catch (err) {
    console.error("infisical Auth Error");
  }

  try {
    const secretValue = await client.secrets().getSecret({
      environment: "dev",
      projectId: process.env.INFISICAL_PROJECT_ID || "",
      secretName: secretName,
      secretPath: "/tenants/",
    });

    return secretValue;
  } catch (error) {
    console.error(error)
    return null;
  }

}


export async function upsertSecret(
  secretName: string,
  secretValue: Record<string, unknown>
): Promise<void>{
  const client = createSecretManagerClient();
  try {
    await client.auth().universalAuth.login({
      clientId: process.env.INFISICAL_CLIENT_ID || "",
      clientSecret: process.env.INFISICAL_CLIENT_SECRET || "",
    });
  } catch (err) {
    console.error("infisical Auth Error");
  }

  console.log("lib/secrets/upsert: Secret Name \n", secretName)
  console.log("lib/secrets/upsert: JSON stringify Secret Value \n", JSON.stringify(secretValue))

  if (await getSecretValue(secretName)) {
    try {
      await client.secrets().updateSecret(secretName, {
        environment: "dev",
        projectId: process.env.INFISICAL_PROJECT_ID || "",
        secretValue: JSON.stringify(secretValue),
        secretPath: "/tenants/",
      });
    } catch (error) {
      console.log("error updating secret");
    }
  } else {
    try {
      await client.secrets().createSecret(secretName, {
        environment: "dev",
        projectId: process.env.INFISICAL_PROJECT_ID || "",
        secretValue: JSON.stringify(secretValue),
        secretPath: "/tenants/",
      });
    } catch (error) {
      console.log("error creating secret key");
      console.error(error)
    }
  }
}


export function parseSecretString<T= Record<string, unknown>>(
  secret: Secret | null
):T | null {
  if (!secret) {
    return null
  }
  try{
    return JSON.parse(secret.secretValue) as T
  }catch{
    return  null
  }
}



