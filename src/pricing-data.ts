import {CloudPricing} from "@/types/pricing-tier.interface";

export const pricingData: CloudPricing = {
    AWS: {
        compute: {
            baseRate: 0.0464, // t3.medium per hour
            additionalFactors: {
                vcpu: { rate: 0.0232, unit: 'per vCPU per hour' },
                memory: { rate: 0.0058, unit: 'per GB per hour' },
                storage: { rate: 0.10, unit: 'per GB per month' }
            }
        },
        storage: {
            baseRate: 0,
            tiers: [
                { min: 0, max: 50000, rate: 0.023 },
                { min: 50000, max: 450000, rate: 0.022 },
                { min: 450000, max: null, rate: 0.021 }
            ],
            additionalFactors: {
                requests: { rate: 0.0004, unit: 'per 1000 requests' },
                dataTransfer: { rate: 0.09, unit: 'per GB' }
            }
        },
        database: {
            baseRate: 0.115, // RDS t3.medium per hour
            additionalFactors: {
                storage: { rate: 0.115, unit: 'per GB per month' },
                iops: { rate: 0.065, unit: 'per IOPS per month' },
                backup: { rate: 0.095, unit: 'per GB per month' }
            }
        },
        messaging: {
            baseRate: 0.40, // per million requests
            additionalFactors: {
                dataTransfer: { rate: 0.09, unit: 'per GB' },
                storage: { rate: 0.30, unit: 'per GB per month' }
            }
        },
        serverless: {
            baseRate: 0.0000166667, // per 100ms
            additionalFactors: {
                memory: { rate: 0.0000000093, unit: 'per GB-second' },
                requests: { rate: 0.20, unit: 'per million requests' }
            }
        },
        cdn: {
            baseRate: 0.085, // per GB transferred
            additionalFactors: {
                requests: { rate: 0.0075, unit: 'per 10,000 requests' }
            }
        }
    },
    Azure: {
        compute: {
            baseRate: 0.0496,
            additionalFactors: {
                vcpu: { rate: 0.0248, unit: 'per vCPU per hour' },
                memory: { rate: 0.0062, unit: 'per GB per hour' },
                storage: { rate: 0.12, unit: 'per GB per month' }
            }
        },
        storage: {
            baseRate: 0,
            tiers: [
                { min: 0, max: 50000, rate: 0.0184 },
                { min: 50000, max: 500000, rate: 0.0177 },
                { min: 500000, max: null, rate: 0.0170 }
            ],
            additionalFactors: {
                requests: { rate: 0.00036, unit: 'per 10,000 requests' },
                dataTransfer: { rate: 0.087, unit: 'per GB' }
            }
        }
        // Add more Azure services...
    },
    GCP: {
        compute: {
            baseRate: 0.0475,
            additionalFactors: {
                vcpu: { rate: 0.0237, unit: 'per vCPU per hour' },
                memory: { rate: 0.0059, unit: 'per GB per hour' },
                storage: { rate: 0.11, unit: 'per GB per month' }
            }
        },
        storage: {
            baseRate: 0,
            tiers: [
                { min: 0, max: 50000, rate: 0.020 },
                { min: 50000, max: 500000, rate: 0.019 },
                { min: 500000, max: null, rate: 0.018 }
            ],
            additionalFactors: {
                requests: { rate: 0.00035, unit: 'per 10,000 requests' },
                dataTransfer: { rate: 0.08, unit: 'per GB' }
            }
        }
        // Add more GCP services...
    }
};
