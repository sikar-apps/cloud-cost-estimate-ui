import {ServiceType} from "@/types/pricing-tier.interface";

export const getServiceInputFields = (service: ServiceType): string[] => {
    switch (service) {
        case 'compute':
            return ['vcpu', 'memory', 'hours', 'storage'];
        case 'storage':
            return ['capacity', 'requests', 'dataTransfer'];
        case 'database':
            return ['instance_size', 'storage', 'iops', 'backup'];
        case 'messaging':
            return ['requests', 'dataTransfer', 'storage'];
        case 'serverless':
            return ['executions', 'memory', 'duration'];
        default:
            return [];
    }
};