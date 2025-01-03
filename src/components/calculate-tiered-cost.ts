import {PricingTier} from "@/types/pricing-tier.interface";

export const calculateTieredCost = (quantity: number, tiers: PricingTier[]): number => {
    let totalCost = 0;
    let remainingQuantity = quantity;

    for (const tier of tiers) {
        const tierQuantity = tier.max === null
            ? remainingQuantity
            : Math.min(remainingQuantity, tier.max - tier.min);

        if (tierQuantity > 0) {
            totalCost += tierQuantity * tier.rate;
            remainingQuantity -= tierQuantity;
        }

        if (remainingQuantity <= 0) break;
    }

    return totalCost;
}