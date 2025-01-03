// pages/index.tsx
"use client"
import {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {CloudProvider, ServiceConfig, ServiceType} from "@/types/pricing-tier.interface";
import {pricingData} from "@/pricing-data";
import {calculateServiceCost} from "@/components/calculate-service-cost";
import {getServiceInputFields} from "@/components/service-input-fields";

const CloudCostCalculator = () => {
  // ... Previous state management code remains the same ...
  const [configs, setConfigs] = useState<ServiceConfig[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

  const addServiceConfig = () => {
    const newConfig: ServiceConfig = {
      provider: 'AWS',
      service: 'compute',
      details: {},
    };
    setConfigs([...configs, newConfig]);
  };

  const updateConfig = (index: number, updates: Partial<ServiceConfig>) => {
    const newConfigs = [...configs];
    newConfigs[index] = { ...newConfigs[index], ...updates };
    setConfigs(newConfigs);

    const newTotalCost = newConfigs.reduce(
        (sum, config) => sum + calculateServiceCost(config),
        0
    );
    setTotalCost(newTotalCost);
  };

  const exportToCSV = () => {
    const headers = ['Provider', 'Service', 'Details', 'Monthly Cost'];
    const rows = configs.map(config => [
      config.provider,
      config.service,
      JSON.stringify(config.details),
      calculateServiceCost(config).toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
      `Total,,,${totalCost.toFixed(2)}`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'cloud_costs.csv';
    link.click();
  };

  const getComparisonData = () => {
    if (configs.length === 0) return [];

    return configs.map(config => {
      const costs = Object.keys(pricingData).map(provider => ({
        provider,
        cost: calculateServiceCost({ ...config, provider: provider as CloudProvider })
      }));

      return {
        service: `${config.service} (${config.provider})`,
        ...costs.reduce((acc, { provider, cost }) => ({
          ...acc,
          [provider]: cost
        }), {})
      };
    });
  };
  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-gray-800 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-semibold">Cloud Cost Calculator</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <button
                  onClick={addServiceConfig}
                  className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Add Service
              </button>

              {configs.map((config, index) => (
                  <div key={index} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex flex-wrap gap-4 mb-4">
                      <select
                          value={config.provider}
                          onChange={(e) =>
                              updateConfig(index, { provider: e.target.value as CloudProvider })
                          }
                          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {Object.keys(pricingData).map(provider => (
                            <option key={provider} value={provider}>{provider}</option>
                        ))}
                      </select>

                      <select
                          value={config.service}
                          onChange={(e) =>
                              updateConfig(index, { service: e.target.value as ServiceType })
                          }
                          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="compute">Compute (EC2/VM)</option>
                        <option value="storage">Storage (S3/Blob)</option>
                        <option value="database">Database (RDS/SQL)</option>
                        <option value="messaging">Messaging (SQS/Queue)</option>
                        <option value="serverless">Serverless (Lambda/Functions)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {getServiceInputFields(config.service).map((field) => (
                          <div key={field} className="flex flex-col">
                            <label className="mb-1 text-sm font-medium text-gray-700">
                              {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                            <input
                                type="number"
                                value={config.details[field] || ''}
                                onChange={(e) =>
                                    updateConfig(index, {
                                      details: {
                                        ...config.details,
                                        [field]: parseFloat(e.target.value) || 0,
                                      },
                                    })
                                }
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={`Enter ${field}`}
                            />
                          </div>
                      ))}
                    </div>

                    <div className="mt-4 text-lg font-medium text-gray-800">
                      Estimated Cost: <span className="text-blue-600">${calculateServiceCost(config).toFixed(2)}</span>/month
                    </div>
                  </div>
              ))}

              {configs.length > 0 && (
                  <div className="mt-8 p-6 bg-white rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">Cost Comparison</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={getComparisonData()}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="service" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="AWS" stroke="#2196F3" />
                          <Line type="monotone" dataKey="Azure" stroke="#4CAF50" />
                      <Line type="monotone" dataKey="GCP" stroke="#F44336" />
                    </LineChart>
                      </ResponsiveContainer>
                  </div>
                </div>
            )}

            <div className="mt-6 p-4 flex justify-between items-center bg-gray-800 rounded-lg text-white">
              <div className="text-xl font-bold">
                Total Estimated Cost: ${totalCost.toFixed(2)}/month
              </div>
              <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
              >
                Export to CSV
              </button>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default CloudCostCalculator;