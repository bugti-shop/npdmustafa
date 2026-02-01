import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NoteType } from '@/types/note';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useHardwareBackButton } from '@/hooks/useHardwareBackButton';
import { getSetting, setSetting } from '@/utils/settingsStorage';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  X,
  Star,
  FileText,
  StickyNote,
  Code,
  Pen,
  Mic,
  Briefcase,
  GraduationCap,
  Heart,
  Plane,
  ShoppingCart,
  Utensils,
  Dumbbell,
  Calendar,
  Target,
  Lightbulb,
  BookOpen,
  Users,
  Home,
  DollarSign,
  Camera,
  Music,
  Palette,
  Sparkles,
  Clock
} from 'lucide-react';

// Import feature images for templates
import featureEditor from '@/assets/feature-editor.png';
import featureFolders from '@/assets/feature-folders.png';
import featureSketch from '@/assets/feature-sketch.png';
import featureTables from '@/assets/feature-tables.png';
import featureCodeEditor from '@/assets/feature-code-editor.png';
import featureFontStyling from '@/assets/feature-font-styling.png';
import featureMedia from '@/assets/feature-media.png';
import featureMindmap from '@/assets/feature-mindmap.png';
import featureNotes from '@/assets/feature-notes.png';
import featureStickyNotes from '@/assets/feature-sticky-notes.png';
import featureNotesTypes from '@/assets/feature-notes-types.png';
import featureProductivityTools from '@/assets/feature-productivity-tools.png';
import featurePriority from '@/assets/feature-priority.png';
import featureOptions from '@/assets/feature-options.png';
import onboardingNotes from '@/assets/onboarding-notes.png';
import onboardingCode from '@/assets/onboarding-code.png';
import onboardingMindmap from '@/assets/onboarding-mindmap.png';
import onboardingVoice from '@/assets/onboarding-voice.png';
import showcaseVoice from '@/assets/showcase-voice.png';
import showcaseFolders from '@/assets/showcase-folders.png';

export interface NoteTemplate {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  noteType: NoteType;
  title: string;
  content: string;
  previewImage?: string;
  isCustom?: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, StickyNote, Code, Pen, Mic, Briefcase, GraduationCap, Heart, Plane,
  ShoppingCart, Utensils, Dumbbell, Calendar, Target, Lightbulb, BookOpen, Users,
  Home, DollarSign, Camera, Music, Palette, Sparkles, Clock, Star
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

const DEFAULT_TEMPLATES: NoteTemplate[] = [
  // Regular Note Templates
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    icon: 'Users',
    category: 'Work & Business',
    description: 'Professional meeting notes template with agenda and action items',
    noteType: 'regular',
    title: 'Meeting Notes - [Date]',
    content: `<h2>📋 Meeting Agenda</h2>
<ul>
<li>Topic 1: </li>
<li>Topic 2: </li>
<li>Topic 3: </li>
</ul>

<h2>👥 Attendees</h2>
<p>• </p>

<h2>📝 Discussion Points</h2>
<p></p>

<h2>✅ Action Items</h2>
<ul>
<li>[ ] Action 1 - Assigned to: - Due: </li>
<li>[ ] Action 2 - Assigned to: - Due: </li>
</ul>

<h2>📅 Next Meeting</h2>
<p>Date: </p>`,
    previewImage: featureEditor
  },
  {
    id: 'daily-journal',
    name: 'Daily Journal',
    icon: 'Calendar',
    category: 'Personal',
    description: 'Reflect on your day with gratitude and goals',
    noteType: 'regular',
    title: 'Journal - [Date]',
    content: `<h2>🌅 Morning Intentions</h2>
<p>Today I will focus on:</p>
<ul>
<li></li>
</ul>

<h2>🙏 Gratitude</h2>
<p>3 things I'm grateful for:</p>
<ol>
<li></li>
<li></li>
<li></li>
</ol>

<h2>💭 Thoughts & Reflections</h2>
<p></p>

<h2>🌙 Evening Review</h2>
<p>What went well today:</p>
<p>What I learned:</p>
<p>Tomorrow I will:</p>`,
    previewImage: featureNotes
  },
  {
    id: 'project-plan',
    name: 'Project Plan',
    icon: 'Target',
    category: 'Work & Business',
    description: 'Organize your project with goals, timeline, and milestones',
    noteType: 'regular',
    title: 'Project: [Name]',
    content: `<h2>🎯 Project Overview</h2>
<p><strong>Project Name:</strong> </p>
<p><strong>Start Date:</strong> </p>
<p><strong>Target Completion:</strong> </p>

<h2>📌 Objectives</h2>
<ul>
<li></li>
</ul>

<h2>📊 Milestones</h2>
<table>
<tr><th>Milestone</th><th>Due Date</th><th>Status</th></tr>
<tr><td></td><td></td><td>🟡 In Progress</td></tr>
</table>

<h2>👥 Team & Responsibilities</h2>
<p></p>

<h2>⚠️ Risks & Blockers</h2>
<p></p>`,
    previewImage: featureTables
  },
  {
    id: 'weekly-review',
    name: 'Weekly Review',
    icon: 'Clock',
    category: 'Productivity',
    description: 'Review your week and plan ahead',
    noteType: 'regular',
    title: 'Weekly Review - Week of [Date]',
    content: `<h2>📈 This Week's Wins</h2>
<ul>
<li></li>
</ul>

<h2>📉 Challenges Faced</h2>
<ul>
<li></li>
</ul>

<h2>📊 Goals Progress</h2>
<p></p>

<h2>💡 Lessons Learned</h2>
<p></p>

<h2>🎯 Next Week's Focus</h2>
<ul>
<li></li>
</ul>

<h2>🔄 Habits Tracking</h2>
<p>Exercise: /7 days</p>
<p>Reading: /7 days</p>
<p>Meditation: /7 days</p>`,
    previewImage: featureProductivityTools
  },
  
  // Sticky Note Templates
  {
    id: 'quick-ideas',
    name: 'Quick Ideas',
    icon: 'Lightbulb',
    category: 'Creative',
    description: 'Capture brilliant ideas before they escape',
    noteType: 'sticky',
    title: '💡 Ideas',
    content: `<p>💡 <strong>Idea:</strong></p>
<p></p>

<p>🤔 <strong>Why it matters:</strong></p>
<p></p>

<p>📝 <strong>Next steps:</strong></p>
<p></p>`,
    previewImage: featureStickyNotes
  },
  {
    id: 'reminder-sticky',
    name: 'Important Reminder',
    icon: 'Sparkles',
    category: 'Personal',
    description: 'Eye-catching reminder that stands out',
    noteType: 'sticky',
    title: '⚠️ REMINDER',
    content: `<p style="font-size: 18px; font-weight: bold; text-align: center;">⚠️ DON'T FORGET! ⚠️</p>

<p style="text-align: center; font-size: 16px;"></p>

<p style="text-align: center;">📅 Due: </p>`,
    previewImage: featurePriority
  },
  {
    id: 'motivational-quote',
    name: 'Motivational Quote',
    icon: 'Star',
    category: 'Personal',
    description: 'Keep inspiring quotes visible',
    noteType: 'sticky',
    title: '✨ Daily Motivation',
    content: `<p style="font-size: 18px; font-style: italic; text-align: center;">"The only way to do great work is to love what you do."</p>

<p style="text-align: center; color: #666;">— Steve Jobs</p>`,
    previewImage: featureFontStyling
  },
  {
    id: 'quick-todo',
    name: 'Quick To-Do',
    icon: 'Target',
    category: 'Productivity',
    description: 'Simple checklist for quick tasks',
    noteType: 'sticky',
    title: '✅ To-Do',
    content: `<ul>
<li>[ ] </li>
<li>[ ] </li>
<li>[ ] </li>
<li>[ ] </li>
</ul>`,
    previewImage: featureOptions
  },

  // Lined Note Templates
  {
    id: 'class-notes',
    name: 'Class Notes',
    icon: 'GraduationCap',
    category: 'Education',
    description: 'Structured notes for lectures and classes',
    noteType: 'lined',
    title: 'Class Notes - [Subject]',
    content: `📚 Subject: 
📅 Date: 
👨‍🏫 Instructor: 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MAIN TOPICS:
1. 
2. 
3. 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY CONCEPTS:


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT DEFINITIONS:
• 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUESTIONS TO REVIEW:
? 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOMEWORK:`,
    previewImage: onboardingNotes
  },
  {
    id: 'book-summary',
    name: 'Book Summary',
    icon: 'BookOpen',
    category: 'Education',
    description: 'Capture key insights from books',
    noteType: 'lined',
    title: 'Book: [Title]',
    content: `📖 Book Title: 
✍️ Author: 
📅 Date Read: 
⭐ Rating: /5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY:


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY TAKEAWAYS:
1. 
2. 
3. 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FAVORITE QUOTES:
"

"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOW I'LL APPLY THIS:`,
    previewImage: featureMedia
  },
  {
    id: 'travel-journal',
    name: 'Travel Journal',
    icon: 'Plane',
    category: 'Travel',
    description: 'Document your adventures and memories',
    noteType: 'lined',
    title: 'Travel: [Destination]',
    content: `✈️ Destination: 
📅 Dates: 
🏨 Accommodation: 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DAY 1:
🌅 Morning:
🌞 Afternoon:
🌙 Evening:
💭 Highlights:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PLACES VISITED:
• 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FOOD TRIED:
🍽️ 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPENSES:
💰 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MEMORIES & PHOTOS:`,
    previewImage: showcaseFolders
  },
  {
    id: 'recipe-note',
    name: 'Recipe',
    icon: 'Utensils',
    category: 'Lifestyle',
    description: 'Save your favorite recipes',
    noteType: 'lined',
    title: 'Recipe: [Name]',
    content: `🍳 Recipe Name: 
⏱️ Prep Time:    🔥 Cook Time: 
🍽️ Servings: 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INGREDIENTS:
• 
• 
• 
• 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSTRUCTIONS:
1. 
2. 
3. 
4. 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NOTES & TIPS:


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐ Rating: /5`,
    previewImage: featureFolders
  },

  // Code Note Templates
  {
    id: 'code-snippet',
    name: 'Code Snippet',
    icon: 'Code',
    category: 'Development',
    description: 'Save reusable code snippets with syntax highlighting',
    noteType: 'code',
    title: 'Snippet: [Name]',
    content: `// Language: JavaScript
// Description: 
// Tags: 

// ═══════════════════════════════════════════════════════

function example() {
  // Your code here
  
}

// ═══════════════════════════════════════════════════════

// Usage Example:

// Notes:`,
    previewImage: featureCodeEditor
  },
  {
    id: 'api-documentation',
    name: 'API Documentation',
    icon: 'Code',
    category: 'Development',
    description: 'Document API endpoints and responses',
    noteType: 'code',
    title: 'API: [Endpoint Name]',
    content: `// API Documentation
// ═══════════════════════════════════════════════════════

// Endpoint: GET /api/v1/resource
// Base URL: https://api.example.com

// ═══════════════════════════════════════════════════════

// REQUEST
// Headers:
// {
//   "Authorization": "Bearer <token>",
//   "Content-Type": "application/json"
// }

// Query Parameters:
// - page: number (optional)
// - limit: number (optional)

// ═══════════════════════════════════════════════════════

// RESPONSE (200 OK)
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "total": 100
  }
}

// ═══════════════════════════════════════════════════════

// Error Response (4xx/5xx)
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}`,
    previewImage: onboardingCode
  },
  {
    id: 'bug-report',
    name: 'Bug Report',
    icon: 'Code',
    category: 'Development',
    description: 'Track and document bugs systematically',
    noteType: 'code',
    title: 'Bug: [Title]',
    content: `// Bug Report
// ═══════════════════════════════════════════════════════

// Title: 
// Severity: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low
// Status: 🔵 Open / 🟣 In Progress / ✅ Fixed

// ═══════════════════════════════════════════════════════

// DESCRIPTION:


// ═══════════════════════════════════════════════════════

// STEPS TO REPRODUCE:
// 1. 
// 2. 
// 3. 

// ═══════════════════════════════════════════════════════

// EXPECTED BEHAVIOR:


// ACTUAL BEHAVIOR:


// ═══════════════════════════════════════════════════════

// ENVIRONMENT:
// - OS: 
// - Browser: 
// - Version: 

// ═══════════════════════════════════════════════════════

// CONSOLE ERRORS:


// ═══════════════════════════════════════════════════════

// FIX NOTES:`,
    previewImage: featureNotesTypes
  },

  // Sketch Note Templates
  {
    id: 'wireframe',
    name: 'UI Wireframe',
    icon: 'Palette',
    category: 'Design',
    description: 'Sketch app layouts and UI designs',
    noteType: 'sketch',
    title: 'Wireframe: [Screen Name]',
    content: '',
    previewImage: featureSketch
  },
  {
    id: 'brainstorm-map',
    name: 'Brainstorm Map',
    icon: 'Lightbulb',
    category: 'Creative',
    description: 'Visually map out ideas and connections',
    noteType: 'sketch',
    title: 'Brainstorm: [Topic]',
    content: '',
    previewImage: onboardingMindmap
  },
  {
    id: 'diagram',
    name: 'Diagram/Flowchart',
    icon: 'Target',
    category: 'Work & Business',
    description: 'Create process flows and diagrams',
    noteType: 'sketch',
    title: 'Diagram: [Name]',
    content: '',
    previewImage: featureMindmap
  },
  {
    id: 'quick-sketch',
    name: 'Quick Sketch',
    icon: 'Pen',
    category: 'Creative',
    description: 'Freeform drawing and doodling',
    noteType: 'sketch',
    title: 'Sketch',
    content: '',
    previewImage: featureSketch
  },
];

const CATEGORIES = [...new Set(DEFAULT_TEMPLATES.map(t => t.category))];

interface NoteTemplateSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: NoteTemplate) => void;
  filterByType?: NoteType;
}

export const NoteTemplateSheet = ({ isOpen, onClose, onSelectTemplate, filterByType }: NoteTemplateSheetProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customTemplates, setCustomTemplates] = useState<NoteTemplate[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NoteTemplate | null>(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIcon, setFormIcon] = useState('Star');
  const [formNoteType, setFormNoteType] = useState<NoteType>('regular');

  useHardwareBackButton({
    onBack: onClose,
    enabled: isOpen,
    priority: 'sheet',
  });

  // Load custom templates
  useEffect(() => {
    getSetting<NoteTemplate[]>('customNoteTemplates', []).then(templates => {
      setCustomTemplates(templates);
      setIsLoaded(true);
    });
  }, []);

  const allTemplates = [...DEFAULT_TEMPLATES, ...customTemplates];
  
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || template.category === selectedCategory;
    const matchesType = !filterByType || template.noteType === filterByType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    const category = template.isCustom ? 'My Templates' : template.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, NoteTemplate[]>);

  const handleSelectTemplate = (template: NoteTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setFormName('');
    setFormTitle('');
    setFormContent('');
    setFormDescription('');
    setFormIcon('Star');
    setFormNoteType('regular');
    setShowCreateDialog(true);
  };

  const handleEditTemplate = (template: NoteTemplate) => {
    setEditingTemplate(template);
    setFormName(template.name);
    setFormTitle(template.title);
    setFormContent(template.content);
    setFormDescription(template.description);
    setFormIcon(template.icon);
    setFormNoteType(template.noteType);
    setShowCreateDialog(true);
  };

  const handleSaveTemplate = async () => {
    const newTemplate: NoteTemplate = {
      id: editingTemplate?.id || `custom-${Date.now()}`,
      name: formName,
      icon: formIcon,
      category: 'My Templates',
      description: formDescription,
      noteType: formNoteType,
      title: formTitle,
      content: formContent,
      isCustom: true
    };

    let updatedTemplates: NoteTemplate[];
    if (editingTemplate) {
      updatedTemplates = customTemplates.map(t => t.id === editingTemplate.id ? newTemplate : t);
    } else {
      updatedTemplates = [...customTemplates, newTemplate];
    }

    setCustomTemplates(updatedTemplates);
    await setSetting('customNoteTemplates', updatedTemplates);
    setShowCreateDialog(false);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const updatedTemplates = customTemplates.filter(t => t.id !== templateId);
    setCustomTemplates(updatedTemplates);
    await setSetting('customNoteTemplates', updatedTemplates);
  };

  const getIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName] || Star;
    return Icon;
  };

  const getNoteTypeIcon = (type: NoteType) => {
    switch (type) {
      case 'regular': return '⬜';
      case 'sticky': return '📕';
      case 'lined': return '📄';
      case 'code': return '💻';
      case 'sketch': return '🎨';
      case 'voice': return '🎤';
      default: return '📝';
    }
  };

  const getNoteTypeLabel = (type: NoteType) => {
    switch (type) {
      case 'regular': return 'Regular';
      case 'sticky': return 'Sticky';
      case 'lined': return 'Lined';
      case 'code': return 'Code';
      case 'sketch': return 'Sketch';
      case 'voice': return 'Voice';
      default: return type;
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl flex flex-col">
          <SheetHeader className="flex-shrink-0 pb-2">
            <SheetTitle className="flex items-center justify-between">
              <span>📝 Note Templates</span>
              <Button size="sm" onClick={handleCreateTemplate}>
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </SheetTitle>
          </SheetHeader>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2 flex-shrink-0">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {CATEGORIES.map(cat => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Templates List */}
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-6 pb-6">
              {Object.entries(groupedTemplates).map(([category, templates]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">{category}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {templates.map((template) => {
                      const Icon = getIcon(template.icon);
                      return (
                        <div
                          key={template.id}
                          className="border border-border rounded-xl overflow-hidden bg-card hover:bg-muted/50 transition-colors"
                        >
                          {/* Preview Image */}
                          {template.previewImage && (
                            <div className="h-32 w-full overflow-hidden bg-muted">
                              <img 
                                src={template.previewImage} 
                                alt={template.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Template Info */}
                          <div 
                            className="p-3 cursor-pointer"
                            onClick={() => handleSelectTemplate(template)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm truncate">{template.name}</h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {getNoteTypeIcon(template.noteType)} {getNoteTypeLabel(template.noteType)}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {template.description}
                                </p>
                              </div>
                              {template.isCustom && (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditTemplate(template);
                                    }}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTemplate(template.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No templates found</p>
                  <p className="text-sm mt-1">Try a different search or create your own</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Create/Edit Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create Template'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., My Meeting Notes"
              />
            </div>

            <div>
              <Label>Note Type</Label>
              <Select value={formNoteType} onValueChange={(v) => setFormNoteType(v as NoteType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">⬜ Regular</SelectItem>
                  <SelectItem value="sticky">📕 Sticky</SelectItem>
                  <SelectItem value="lined">📄 Lined</SelectItem>
                  <SelectItem value="code">💻 Code</SelectItem>
                  <SelectItem value="sketch">🎨 Sketch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {ICON_OPTIONS.slice(0, 20).map((iconName) => {
                  const IconComp = ICON_MAP[iconName];
                  return (
                    <button
                      key={iconName}
                      onClick={() => setFormIcon(iconName)}
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center border transition-colors",
                        formIcon === iconName 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:bg-muted"
                      )}
                    >
                      <IconComp className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description of this template"
              />
            </div>

            <div>
              <Label>Note Title</Label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Default title for new notes"
              />
            </div>

            <div>
              <Label>Note Content (HTML supported)</Label>
              <Textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Template content..."
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={!formName.trim()}>
              {editingTemplate ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NoteTemplateSheet;
