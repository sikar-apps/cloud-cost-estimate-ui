import {ServiceConfig} from "@/types/pricing-tier.interface";
import {pricingData} from "@/pricing-data";
import {calculateTieredCost} from "@/components/calculate-tiered-cost";

export const calculateServiceCost = (config: ServiceConfig): number => {
    const providerRates = pricingData[config.provider]?.[config.service];
    if (!providerRates) return 0;

    let cost = 0;

    // Handle tiered pricing
    if (providerRates.tiers) {
        const primaryMetric = Object.keys(config.details)[0];
        cost = calculateTieredCost(config.details[primaryMetric], providerRates.tiers);
    } else {
        cost = providerRates.baseRate;
    }

    // Service-specific calculations
    switch (config.service) {
        case 'compute':
            const hourlyCompute = (
                (config.details.vcpu || 0) * providerRates.additionalFactors.vcpu.rate +
                (config.details.memory || 0) * providerRates.additionalFactors.memory.rate
            );
            cost = hourlyCompute * (config.details.hours || 730);
            break;

        case 'storage':
            cost += ((config.details.requests || 0) / 1000) * providerRates.additionalFactors.requests.rate;
            break;

        case 'serverless':
            const gbSeconds = (config.details.memory || 0) * (config.details.duration || 0) * (config.details.executions || 0) / 1000;
            cost = gbSeconds * providerRates.additionalFactors.memory.rate;
            cost += ((config.details.executions || 0) / 1000000) * providerRates.additionalFactors.requests.rate;
            break;
    }

    // Additional factors
    Object.entries(config.details).forEach(([factor, value]) => {
        if (providerRates.additionalFactors[factor] && factor !== 'vcpu' && factor !== 'memory') {
            cost += value * providerRates.additionalFactors[factor].rate;
        }
    });

    return cost;
};