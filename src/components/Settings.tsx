import { useState } from 'react';
import { Settings as SettingsIcon, RotateCcw } from 'lucide-react';
import { useStore } from '../store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { prebuiltAppConfig } from '@mlc-ai/web-llm';

// Available models for WebLLM
const AVAILABLE_MODELS = prebuiltAppConfig.model_list.map(model => ({
    value: model.model_id,
    label: model.model_id
}))

const TEMPERATURE_OPTIONS = [
    { value: 0.1, label: '0.1 (Very Focused)' },
    { value: 0.3, label: '0.3 (Focused)' },
    { value: 0.5, label: '0.5 (Balanced)' },
    { value: 0.7, label: '0.7 (Creative)' },
    { value: 0.9, label: '0.9 (Very Creative)' },
    { value: 1.0, label: '1.0 (Maximum Creativity)' },
];

const MAX_TOKENS_OPTIONS = [
    { value: 1000, label: '1000 (Short)' },
    { value: 1500, label: '1500 (Medium)' },
    { value: 2000, label: '2000 (Long)' },
    { value: 3000, label: '3000 (Very Long)' },
    { value: 4000, label: '4000 (Maximum)' },
];

const LANGUAGE_OPTIONS = [
    { value: 'auto', label: 'Auto-detect' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'ru', label: 'Русский' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
    { value: 'zh', label: '中文' },
    { value: 'ar', label: 'العربية' },
];

const THEME_OPTIONS = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
];

export function Settings() {
    const { settings, updateSettings, resetSettings } = useStore();
    const [isOpen, setIsOpen] = useState(false);

    const handleModelChange = (model: string) => {
        updateSettings({ defaultModel: model });
        toast.success('Default model updated');
    };

    const handleTemperatureChange = (temperature: string) => {
        updateSettings({ temperature: parseFloat(temperature) });
        toast.success('Temperature updated');
    };

    const handleMaxTokensChange = (maxTokens: string) => {
        updateSettings({ maxTokens: parseInt(maxTokens) });
        toast.success('Max tokens updated');
    };

    const handleLanguageChange = (language: string) => {
        updateSettings({ language });
        toast.success('Language preference updated');
    };

    const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
        updateSettings({ theme });
        toast.success('Theme updated');
    };

    const handleResetSettings = () => {
        resetSettings();
        toast.success('Settings reset to defaults');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                >
                    <SettingsIcon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetSettings}
                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                    >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                    </Button>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* AI Model Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">AI Model</CardTitle>
                            <CardDescription>
                                Choose the AI model for course generation. Smaller models are faster but may be less capable.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="model-select">Default Model</Label>
                                <Select value={settings.defaultModel} onValueChange={handleModelChange}>
                                    <SelectTrigger id="model-select">
                                        <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AVAILABLE_MODELS.map((model) => (
                                            <SelectItem key={model.value} value={model.value}>
                                                {model.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="temperature-select">Creativity (Temperature)</Label>
                                <Select
                                    value={settings.temperature.toString()}
                                    onValueChange={handleTemperatureChange}
                                >
                                    <SelectTrigger id="temperature-select">
                                        <SelectValue placeholder="Select creativity level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TEMPERATURE_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value.toString()}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tokens-select">Response Length (Max Tokens)</Label>
                                <Select
                                    value={settings.maxTokens.toString()}
                                    onValueChange={handleMaxTokensChange}
                                >
                                    <SelectTrigger id="tokens-select">
                                        <SelectValue placeholder="Select response length" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MAX_TOKENS_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value.toString()}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Language & Interface Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Language & Interface</CardTitle>
                            <CardDescription>
                                Customize the language and appearance of the application.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="language-select">Preferred Language</Label>
                                <Select value={settings.language} onValueChange={handleLanguageChange}>
                                    <SelectTrigger id="language-select">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LANGUAGE_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="theme-select">Theme</Label>
                                <Select value={settings.theme} onValueChange={handleThemeChange}>
                                    <SelectTrigger id="theme-select">
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {THEME_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Current Settings Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Current Configuration</CardTitle>
                            <CardDescription>
                                Summary of your current settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Model:</span> {
                                        AVAILABLE_MODELS.find(m => m.value === settings.defaultModel)?.label || settings.defaultModel
                                    }
                                </div>
                                <div>
                                    <span className="font-medium">Temperature:</span> {settings.temperature}
                                </div>
                                <div>
                                    <span className="font-medium">Max Tokens:</span> {settings.maxTokens}
                                </div>
                                <div>
                                    <span className="font-medium">Language:</span> {
                                        LANGUAGE_OPTIONS.find(l => l.value === settings.language)?.label || settings.language
                                    }
                                </div>
                                <div>
                                    <span className="font-medium">Theme:</span> {
                                        THEME_OPTIONS.find(t => t.value === settings.theme)?.label || settings.theme
                                    }
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
