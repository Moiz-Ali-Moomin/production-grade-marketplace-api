import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { logger } from '@/observability/logger';

const client = new SecretsManagerClient({ region: process.env.AWS_REGION || 'us-east-1' });

export const getSecret = async (secretName: string): Promise<any> => {
    try {
        const response = await client.send(
            new GetSecretValueCommand({ SecretId: secretName })
        );

        if (response.SecretString) {
            return JSON.parse(response.SecretString);
        }

        return null;
    } catch (error) {
        logger.error(`Error fetching secret: ${secretName}`, { error });
        // In production, you might want to throw here to prevent booting with empty config
        return null;
    }
};

/**
 * Example usage in app bootstrap:
 * 
 * const secrets = await getSecret('prod/marketplace/env');
 * process.env.STRIPE_SECRET_KEY = secrets.STRIPE_SECRET_KEY;
 */
