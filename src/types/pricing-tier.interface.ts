export interface PricingTier {
    min: number;
    max: number | null;
    rate: number;
}

export interface ServicePricing {
    baseRate: number;
    tiers?: PricingTier[];
    additionalFactors: {
        [key: string]: {
            rate: number;
            unit: string;
        };
    };
}

export interface CloudPricing {
    [key: string]: {
        [key: string]: ServicePricing;
    };
}
export interface ServiceConfig {
    provider: CloudProvider;
    service: ServiceType;
    details: {
        [key: string]: number;
    };
}
export type CloudProvider = 'AWS' | 'Azure' | 'GCP' | 'Oracle';

export type ServiceType = 'compute' | 'storage' | 'database' | 'messaging' | 'serverless';