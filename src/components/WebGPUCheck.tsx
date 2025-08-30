/// <reference types="@webgpu/types" />

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface WebGPUStatus {
    supported: boolean;
    adapter: boolean;
    device: boolean;
    error?: string;
}

export function WebGPUCheck() {
    const [status, setStatus] = useState<WebGPUStatus | null>(null);

    useEffect(() => {
        const checkWebGPU = async () => {
            const result: WebGPUStatus = {
                supported: false,
                adapter: false,
                device: false
            };

            try {
                // Check if WebGPU is supported
                if (!navigator.gpu) {
                    result.error = 'WebGPU is not supported in this browser. Please use Chrome 113+, Edge 113+, or Firefox with WebGPU enabled.';
                    setStatus(result);
                    return;
                }

                result.supported = true;

                // Try to get an adapter
                const adapter = await navigator.gpu.requestAdapter();
                if (!adapter) {
                    result.error = 'Failed to get WebGPU adapter. Your GPU may not be supported.';
                    setStatus(result);
                    return;
                }

                result.adapter = true;

                // Try to get a device
                const device = await adapter.requestDevice();
                if (device) {
                    result.device = true;
                    console.log('WebGPU fully supported:', {
                        adapter: adapter.info,
                        features: Array.from(adapter.features),
                        limits: adapter.limits
                    });
                }

                setStatus(result);
            } catch (error) {
                result.error = `WebGPU check failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
                setStatus(result);
                console.error('WebGPU check error:', error);
            }
        };

        checkWebGPU();
    }, []);

    useEffect(() => {
        if (status) {
            if (status.error) {
                toast.error(status.error);
            } else if (status.device) {
                console.log('✅ WebGPU is fully supported and ready');
            } else if (status.adapter) {
                toast.warning('WebGPU adapter available but device creation failed');
            } else if (status.supported) {
                toast.warning('WebGPU supported but adapter request failed');
            }
        }
    }, [status]);

    // This component doesn't render anything, it just checks WebGPU support
    return null;
}
