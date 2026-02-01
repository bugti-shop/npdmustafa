import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ChevronRight, ChevronLeft, ListTodo, Settings2, Bell, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { getSetting, setSetting } from '@/utils/settingsStorage';
import { toast } from 'sonner';
import { useHardwareBackButton } from '@/hooks/useHardwareBackButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface TasksSettings {
  defaultPriority: 'none' | 'low' | 'medium' | 'high';
  defaultDueDate: 'none' | 'today' | 'tomorrow';
  showCompletedTasks: boolean;
  autoArchiveCompleted: boolean;
  archiveAfterDays: number;
  confirmBeforeDelete: boolean;
  swipeToComplete: boolean;
  // Display settings
  showDateTime: boolean;
  showStatus: boolean;
  showSubtasks: boolean;
  // Reminder defaults
  defaultReminderTime: string;
  reminderSound: boolean;
  reminderVibration: boolean;
}

const DEFAULT_TASKS_SETTINGS: TasksSettings = {
  defaultPriority: 'none',
  defaultDueDate: 'none',
  showCompletedTasks: true,
  autoArchiveCompleted: false,
  archiveAfterDays: 7,
  confirmBeforeDelete: true,
  swipeToComplete: true,
  showDateTime: false,
  showStatus: false,
  showSubtasks: false,
  defaultReminderTime: '09:00',
  reminderSound: true,
  reminderVibration: true,
};

type SubPage = 'main' | 'defaults' | 'display' | 'behavior' | 'reminders';

interface TasksSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TasksSettingsSheet = ({ isOpen, onClose }: TasksSettingsSheetProps) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<TasksSettings>(DEFAULT_TASKS_SETTINGS);
  const [currentPage, setCurrentPage] = useState<SubPage>('main');
  const [isLoading, setIsLoading] = useState(true);

  useHardwareBackButton({
    onBack: () => {
      if (currentPage !== 'main') {
        setCurrentPage('main');
      } else {
        onClose();
      }
    },
    enabled: isOpen,
    priority: 'sheet',
  });

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  // Reset to main page when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentPage('main');
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const saved = await getSetting<TasksSettings | null>('tasksSettings', null);
      if (saved) {
        setSettings({ ...DEFAULT_TASKS_SETTINGS, ...saved });
      }
    } catch (error) {
      console.error('Error loading tasks settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: TasksSettings) => {
    setSettings(newSettings);
    await setSetting('tasksSettings', newSettings);
    // Dispatch event to notify all task components
    window.dispatchEvent(new CustomEvent('tasksSettingsChanged', { detail: newSettings }));
  };

  const updateSetting = async <K extends keyof TasksSettings>(key: K, value: TasksSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    await saveSettings(newSettings);
    toast.success(t('settings.settingsSaved', 'Settings saved'));
  };

  const SettingsRow = ({ 
    label, 
    subtitle,
    onClick, 
    rightElement,
    icon: Icon,
  }: { 
    label: string; 
    subtitle?: string;
    onClick?: () => void; 
    rightElement?: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 border-b border-border/50",
        onClick && "hover:bg-muted/50 transition-colors"
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <div className="flex flex-col items-start">
          <span className="text-foreground text-sm">{label}</span>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      </div>
      {rightElement || (onClick && <ChevronRight className="h-4 w-4 text-muted-foreground" />)}
    </button>
  );

  const SectionHeading = ({ title }: { title: string }) => (
    <div className="px-4 py-2 bg-muted/50">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</span>
    </div>
  );

  const BackButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
      <ChevronLeft className="h-5 w-5" />
    </button>
  );

  // Main page
  const renderMainPage = () => (
    <>
      <SheetHeader className="px-4 py-3 border-b">
        <SheetTitle className="text-lg">{t('settings.tasksSettings', 'Tasks Settings')}</SheetTitle>
      </SheetHeader>
      <ScrollArea className="flex-1">
        <div className="py-2">
          <SettingsRow 
            icon={ListTodo}
            label={t('settings.defaultSettings', 'Default Settings')}
            subtitle={t('settings.defaultSettingsDesc', 'Priority, due date defaults')}
            onClick={() => setCurrentPage('defaults')}
          />
          <SettingsRow 
            icon={Settings2}
            label={t('settings.displaySettings', 'Display Settings')}
            subtitle={t('settings.displaySettingsDesc', 'What to show on task cards')}
            onClick={() => setCurrentPage('display')}
          />
          <SettingsRow 
            icon={Bell}
            label={t('settings.reminderSettings', 'Reminder Settings')}
            subtitle={t('settings.reminderSettingsDesc', 'Default reminder options')}
            onClick={() => setCurrentPage('reminders')}
          />
          <SettingsRow 
            icon={Trash2}
            label={t('settings.behaviorSettings', 'Behavior & Actions')}
            subtitle={t('settings.behaviorSettingsDesc', 'Swipe actions, confirmations')}
            onClick={() => setCurrentPage('behavior')}
          />
        </div>
      </ScrollArea>
    </>
  );

  // Default Settings page
  const renderDefaultsPage = () => (
    <>
      <SheetHeader className="px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <BackButton onClick={() => setCurrentPage('main')} />
          <SheetTitle className="text-lg">{t('settings.defaultSettings', 'Default Settings')}</SheetTitle>
        </div>
      </SheetHeader>
      <ScrollArea className="flex-1">
        <div className="py-2">
          <SectionHeading title={t('settings.newTaskDefaults', 'New Task Defaults')} />
          
          <div className="px-4 py-3 border-b border-border/50">
            <label className="text-sm text-muted-foreground mb-2 block">
              {t('settings.defaultPriority', 'Default Priority')}
            </label>
            <Select 
              value={settings.defaultPriority} 
              onValueChange={(v: TasksSettings['defaultPriority']) => updateSetting('defaultPriority', v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('priority.none', 'None')}</SelectItem>
                <SelectItem value="low">{t('priority.low', 'Low')}</SelectItem>
                <SelectItem value="medium">{t('priority.medium', 'Medium')}</SelectItem>
                <SelectItem value="high">{t('priority.high', 'High')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="px-4 py-3">
            <label className="text-sm text-muted-foreground mb-2 block">
              {t('settings.defaultDueDate', 'Default Due Date')}
            </label>
            <Select 
              value={settings.defaultDueDate} 
              onValueChange={(v: TasksSettings['defaultDueDate']) => updateSetting('defaultDueDate', v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('dueDate.none', 'None')}</SelectItem>
                <SelectItem value="today">{t('dueDate.today', 'Today')}</SelectItem>
                <SelectItem value="tomorrow">{t('dueDate.tomorrow', 'Tomorrow')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollArea>
    </>
  );

  // Display Settings page
  const renderDisplayPage = () => (
    <>
      <SheetHeader className="px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <BackButton onClick={() => setCurrentPage('main')} />
          <SheetTitle className="text-lg">{t('settings.displaySettings', 'Display Settings')}</SheetTitle>
        </div>
      </SheetHeader>
      <ScrollArea className="flex-1">
        <div className="py-2">
          <SectionHeading title={t('settings.taskCardDisplay', 'Task Card Display')} />

          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <div className="flex-1 pr-4">
              <span className="text-foreground text-sm block">
                {t('settings.showDateTime', 'Show Date & Time')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('settings.showDateTimeDesc', 'Display due date and reminder time on task cards')}
              </span>
            </div>
            <Switch
              checked={settings.showDateTime}
              onCheckedChange={(checked) => updateSetting('showDateTime', checked)}
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <div className="flex-1 pr-4">
              <span className="text-foreground text-sm block">
                {t('settings.showStatus', 'Show Status Badge')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('settings.showStatusDesc', 'Display task status (In Progress, Almost Done, etc.)')}
              </span>
            </div>
            <Switch
              checked={settings.showStatus}
              onCheckedChange={(checked) => updateSetting('showStatus', checked)}
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <div className="flex-1 pr-4">
              <span className="text-foreground text-sm block">
                {t('settings.showSubtasks', 'Show Subtasks Count')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('settings.showSubtasksDesc', 'Display number of subtasks on task cards')}
              </span>
            </div>
            <Switch
              checked={settings.showSubtasks}
              onCheckedChange={(checked) => updateSetting('showSubtasks', checked)}
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex-1 pr-4">
              <span className="text-foreground text-sm block">
                {t('settings.showCompletedTasks', 'Show Completed Tasks')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('settings.showCompletedTasksDesc', 'Display completed tasks in the list')}
              </span>
            </div>
            <Switch
              checked={settings.showCompletedTasks}
              onCheckedChange={(checked) => updateSetting('showCompletedTasks', checked)}
            />
          </div>
        </div>
      </ScrollArea>
    </>
  );

  // Reminder Settings page
  const renderRemindersPage = () => (
    <>
      <SheetHeader className="px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <BackButton onClick={() => setCurrentPage('main')} />
          <SheetTitle className="text-lg">{t('settings.reminderSettings', 'Reminder Settings')}</SheetTitle>
        </div>
      </SheetHeader>
      <ScrollArea className="flex-1">
        <div className="py-2">
          <SectionHeading title={t('settings.reminderDefaults', 'Reminder Defaults')} />

          <div className="px-4 py-3 border-b border-border/50">
            <label className="text-sm text-muted-foreground mb-2 block">
              {t('settings.defaultReminderTime', 'Default Reminder Time')}
            </label>
            <input
              type="time"
              value={settings.defaultReminderTime}
              onChange={(e) => updateSetting('defaultReminderTime', e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <div className="flex-1 pr-4">
              <span className="text-foreground text-sm block">
                {t('settings.reminderSound', 'Reminder Sound')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('settings.reminderSoundDesc', 'Play sound when reminder triggers')}
              </span>
            </div>
            <Switch
              checked={settings.reminderSound}
              onCheckedChange={(checked) => updateSetting('reminderSound', checked)}
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex-1 pr-4">
              <span className="text-foreground text-sm block">
                {t('settings.reminderVibration', 'Reminder Vibration')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('settings.reminderVibrationDesc', 'Vibrate device when reminder triggers')}
              </span>
            </div>
            <Switch
              checked={settings.reminderVibration}
              onCheckedChange={(checked) => updateSetting('reminderVibration', checked)}
            />
          </div>
        </div>
      </ScrollArea>
    </>
  );

  // Behavior Settings page
  const renderBehaviorPage = () => (
    <>
      <SheetHeader className="px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <BackButton onClick={() => setCurrentPage('main')} />
          <SheetTitle className="text-lg">{t('settings.behaviorSettings', 'Behavior & Actions')}</SheetTitle>
        </div>
      </SheetHeader>
      <ScrollArea className="flex-1">
        <div className="py-2">
          <SectionHeading title={t('settings.swipeActions', 'Swipe Actions')} />

          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <div className="flex-1 pr-4">
              <span className="text-foreground text-sm block">
                {t('settings.swipeToComplete', 'Swipe to Complete')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('settings.swipeToCompleteDesc', 'Swipe right on a task to mark it complete')}
              </span>
            </div>
            <Switch
              checked={settings.swipeToComplete}
              onCheckedChange={(checked) => updateSetting('swipeToComplete', checked)}
            />
          </div>

          <SectionHeading title={t('settings.confirmations', 'Confirmations')} />

          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex-1 pr-4">
              <span className="text-foreground text-sm block">
                {t('settings.confirmBeforeDelete', 'Confirm Before Delete')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('settings.confirmBeforeDeleteDesc', 'Show confirmation dialog before deleting tasks')}
              </span>
            </div>
            <Switch
              checked={settings.confirmBeforeDelete}
              onCheckedChange={(checked) => updateSetting('confirmBeforeDelete', checked)}
            />
          </div>
        </div>
      </ScrollArea>
    </>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl p-0 flex flex-col">
        {currentPage === 'main' && renderMainPage()}
        {currentPage === 'defaults' && renderDefaultsPage()}
        {currentPage === 'display' && renderDisplayPage()}
        {currentPage === 'reminders' && renderRemindersPage()}
        {currentPage === 'behavior' && renderBehaviorPage()}
      </SheetContent>
    </Sheet>
  );
};

// Hook to access tasks settings with live updates
export const useTasksSettings = () => {
  const [settings, setSettings] = useState<TasksSettings>(DEFAULT_TASKS_SETTINGS);

  useEffect(() => {
    const loadSettings = async () => {
      const saved = await getSetting<TasksSettings | null>('tasksSettings', null);
      if (saved) {
        setSettings({ ...DEFAULT_TASKS_SETTINGS, ...saved });
      }
    };
    
    loadSettings();

    // Listen for settings changes
    const handleChange = (e: CustomEvent<TasksSettings>) => {
      setSettings({ ...DEFAULT_TASKS_SETTINGS, ...e.detail });
    };
    window.addEventListener('tasksSettingsChanged', handleChange as EventListener);
    return () => window.removeEventListener('tasksSettingsChanged', handleChange as EventListener);
  }, []);

  return settings;
};

// Export defaults for use in other components
export const DEFAULT_TASKS_SETTINGS_VALUES = DEFAULT_TASKS_SETTINGS;
