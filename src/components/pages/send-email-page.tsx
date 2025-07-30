import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  IconBold, 
  IconItalic, 
  IconUnderline,
  IconStrikethrough,
  IconAlignLeft,
  IconList,
  IconListNumbers,
  IconLink,
  IconPhoto,
  IconPaperclip,
  IconSend,
  IconEye,
  IconX,
  IconPlus
} from "@tabler/icons-react";

import { useEmailComposer } from "@/hooks/use-email-composer";
import { EmailTemplateService } from "@/services/email-templates";
import { KeyboardShortcutsService } from "@/services/keyboard-shortcuts";
import { RichTextEditor, RichTextEditorRef, FormatState } from "@/components/rich-text-editor";

export function SendEmailPage() {
  const { state, actions, textareaRef } = useEmailComposer();
  const richTextEditorRef = useRef<RichTextEditorRef>(null);
  const [activeTab, setActiveTab] = useState<"compose" | "templates">("compose");
  const [toInput, setToInput] = useState("");
  const [ccInput, setCcInput] = useState("");
  const [bccInput, setBccInput] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  // NEW: Track formatting state from RichTextEditor
  const [editorFormats, setEditorFormats] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    orderedList: false,
    unorderedList: false,
    link: false
  });

  const testEmails = [
    "delivered@resend.dev",
    "bounced@resend.dev",
    "complained@resend.dev",
  ];

  // Helper functions
  const handleKeyPress = useCallback((
    e: React.KeyboardEvent, 
    type: 'to' | 'cc' | 'bcc', 
    value: string, 
    setValue: (value: string) => void
  ) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
      e.preventDefault();
      if (value.trim()) {
        actions.addRecipient(type, value.trim());
        setValue("");
      }
    }
  }, [actions]);

  const handleBlur = useCallback((
    type: 'to' | 'cc' | 'bcc', 
    value: string, 
    setValue: (value: string) => void
  ) => {
    if (value.trim()) {
      actions.addRecipient(type, value.trim());
      setValue("");
    }
  }, [actions]);

  const handleSendEmail = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await actions.sendEmail();
  }, [actions]);

  const handleInsertLink = useCallback(() => {
    if (linkUrl) {
      if (richTextEditorRef.current) {
        richTextEditorRef.current.applyFormatting('insertLink', linkUrl);
      } else {
        const position = textareaRef.current?.selectionStart || 0;
        actions.insertLink(linkUrl, linkText || undefined, position);
      }
      setLinkUrl("");
      setLinkText("");
      setShowLinkDialog(false);
    }
  }, [linkUrl, linkText, actions, textareaRef]);

  const handleFormatting = useCallback((format: 'bold' | 'italic' | 'underline' | 'strikethrough') => {
    if (richTextEditorRef.current) {
      richTextEditorRef.current.applyFormatting(format);
      setTimeout(() => {
        if (richTextEditorRef.current) {
          setEditorFormats(richTextEditorRef.current.getFormatState());
        }
      }, 0);
    } else {
      actions.applyFormatting(format);
    }
  }, [actions]);

  const handleInsertList = useCallback((type: 'bullet' | 'numbered') => {
    if (richTextEditorRef.current) {
      const command = type === 'bullet' ? 'insertUnorderedList' : 'insertOrderedList';
      richTextEditorRef.current.applyFormatting(command);
      setTimeout(() => {
        if (richTextEditorRef.current) {
          setEditorFormats(richTextEditorRef.current.getFormatState());
        }
      }, 0);
    } else {
      const position = textareaRef.current?.selectionStart || 0;
      actions.insertList(type, position);
    }
  }, [actions, textareaRef]);

  // Setup keyboard event handler
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      KeyboardShortcutsService.handleKeyboardEvent(event);
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);

  return (
    <TooltipProvider>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="max-w-4xl mx-auto">
                {state.success && (
                  <Alert className="mb-6">
                    <AlertDescription>
                      Email sent successfully!
                    </AlertDescription>
                  </Alert>
                )}
                
                {state.error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>
                      {state.error}
                    </AlertDescription>
                  </Alert>
                )}

                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "compose" | "templates")}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="compose">Compose</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                  </TabsList>

                  <TabsContent value="compose">
                    <Card>
                      <CardContent className="p-0">
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          void handleSendEmail(e);
                        }} className="space-y-0">
                          {/* Email Header */}
                          <div className="border-b p-4 space-y-3">
                            {/* To Field */}
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium w-12">To</Label>
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 min-h-[40px] border rounded-md px-3 py-2">
                                  {state.recipients.to.map((email) => (
                                    <Badge key={email} variant="secondary" className="gap-1">
                                      {email}
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => actions.removeRecipient('to', email)}
                                      >
                                        <IconX className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  ))}
                                  <Input
                                    value={toInput}
                                    onChange={(e) => setToInput(e.target.value)}
                                    onKeyDown={(e) => handleKeyPress(e, 'to', toInput, setToInput)}
                                    onBlur={() => handleBlur('to', toInput, setToInput)}
                                    placeholder={state.recipients.to.length === 0 ? "Enter recipients" : ""}
                                    className="border-0 p-0 h-6 flex-1 min-w-[200px] focus-visible:ring-0"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {!state.showCC && (
                                  <Button type="button" variant="ghost" size="sm" onClick={() => actions.setShowCC(true)}>
                                    CC
                                  </Button>
                                )}
                                {!state.showBCC && (
                                  <Button type="button" variant="ghost" size="sm" onClick={() => actions.setShowBCC(true)}>
                                    BCC
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* CC Field */}
                            {state.showCC && (
                              <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium w-12">CC</Label>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2 min-h-[40px] border rounded-md px-3 py-2">
                                    {state.recipients.cc.map((email) => (
                                      <Badge key={email} variant="secondary" className="gap-1">
                                        {email}
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                          onClick={() => actions.removeRecipient('cc', email)}
                                        >
                                          <IconX className="h-3 w-3" />
                                        </Button>
                                      </Badge>
                                    ))}
                                    <Input
                                      value={ccInput}
                                      onChange={(e) => setCcInput(e.target.value)}
                                      onKeyDown={(e) => handleKeyPress(e, 'cc', ccInput, setCcInput)}
                                      onBlur={() => handleBlur('cc', ccInput, setCcInput)}
                                      placeholder={state.recipients.cc.length === 0 ? "Enter CC recipients" : ""}
                                      className="border-0 p-0 h-6 flex-1 min-w-[200px] focus-visible:ring-0"
                                    />
                                  </div>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={() => actions.setShowCC(false)}>
                                  <IconX className="h-4 w-4" />
                                </Button>
                              </div>
                            )}

                            {/* BCC Field */}
                            {state.showBCC && (
                              <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium w-12">BCC</Label>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2 min-h-[40px] border rounded-md px-3 py-2">
                                    {state.recipients.bcc.map((email) => (
                                      <Badge key={email} variant="secondary" className="gap-1">
                                        {email}
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                          onClick={() => actions.removeRecipient('bcc', email)}
                                        >
                                          <IconX className="h-3 w-3" />
                                        </Button>
                                      </Badge>
                                    ))}
                                    <Input
                                      value={bccInput}
                                      onChange={(e) => setBccInput(e.target.value)}
                                      onKeyDown={(e) => handleKeyPress(e, 'bcc', bccInput, setBccInput)}
                                      onBlur={() => handleBlur('bcc', bccInput, setBccInput)}
                                      placeholder={state.recipients.bcc.length === 0 ? "Enter BCC recipients" : ""}
                                      className="border-0 p-0 h-6 flex-1 min-w-[200px] focus-visible:ring-0"
                                    />
                                  </div>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={() => actions.setShowBCC(false)}>
                                  <IconX className="h-4 w-4" />
                                </Button>
                              </div>
                            )}

                            {/* Subject Field */}
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium w-12">Subject</Label>
                              <Input
                                value={state.subject}
                                onChange={(e) => actions.setSubject(e.target.value)}
                                placeholder="Enter subject"
                                className="flex-1"
                                required
                              />
                            </div>
                          </div>

                          {/* Quick Test Recipients */}
                          <div className="border-b p-4">
                            <Label className="text-sm font-medium mb-2 block">Quick Test Recipients</Label>
                            <div className="flex flex-wrap gap-2">
                              {testEmails.map((email) => (
                                <Button
                                  key={email}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => actions.addRecipient('to', email)}
                                  className="text-xs"
                                >
                                  <IconPlus className="h-3 w-3 mr-1" />
                                  {email}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Formatting Toolbar */}
                          <div className="border-b p-2 flex flex-wrap items-center gap-1">
                            <div className="flex items-center gap-1 border-r pr-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant={editorFormats.bold ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleFormatting('bold')}
                                  >
                                    <IconBold className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Bold (Ctrl+B)</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant={editorFormats.italic ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleFormatting('italic')}
                                  >
                                    <IconItalic className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Italic (Ctrl+I)</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant={editorFormats.underline ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleFormatting('underline')}
                                  >
                                    <IconUnderline className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Underline (Ctrl+U)</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant={editorFormats.strikethrough ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => handleFormatting('strikethrough')}
                                  >
                                    <IconStrikethrough className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Strikethrough</TooltipContent>
                              </Tooltip>
                            </div>

                            <div className="flex items-center gap-1 border-r pr-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button type="button" variant="ghost" size="sm">
                                    <IconAlignLeft className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Align Left</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleInsertList('bullet')}
                                  >
                                    <IconList className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Bullet List (Ctrl+Shift+L)</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleInsertList('numbered')}
                                  >
                                    <IconListNumbers className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Numbered List (Ctrl+Shift+N)</TooltipContent>
                              </Tooltip>
                            </div>

                            <div className="flex items-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setShowLinkDialog(true)}
                                  >
                                    <IconLink className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Insert Link (Ctrl+K)</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button type="button" variant="ghost" size="sm" disabled>
                                    <IconPhoto className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Insert Image (Coming Soon)</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button type="button" variant="ghost" size="sm" disabled>
                                    <IconPaperclip className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Attach File (Coming Soon)</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>

                          {/* Message Composer */}
                          <div className="p-4 border-0">
                            <RichTextEditor
                              ref={richTextEditorRef}
                              value={state.message}
                              onChange={actions.setMessage}
                              placeholder="Write your email message here..."
                              className="border-0 focus:ring-0"
                              onFormatStateChange={setEditorFormats}
                            />
                          </div>

                          {/* Email Options */}
                          <div className="border-t p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Priority</Label>
                                <Select value={state.priority} onValueChange={actions.setPriority}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low Priority</SelectItem>
                                    <SelectItem value="normal">Normal Priority</SelectItem>
                                    <SelectItem value="high">High Priority</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Schedule Send</Label>
                                <Input
                                  type="datetime-local"
                                  value={state.scheduleTime}
                                  onChange={(e) => actions.setScheduleTime(e.target.value)}
                                  placeholder="Send immediately"
                                />
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="receipt"
                                    checked={state.requestReceipt}
                                    onCheckedChange={actions.setRequestReceipt}
                                  />
                                  <Label htmlFor="receipt" className="text-sm">Request read receipt</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="confidential"
                                    checked={state.confidential}
                                    onCheckedChange={actions.setConfidential}
                                  />
                                  <Label htmlFor="confidential" className="text-sm">Confidential mode</Label>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Send Button */}
                          <div className="p-4 flex justify-between items-center">
                            <div className="flex gap-2">
                              <Button
                                type="submit"
                                disabled={state.isSending || state.recipients.to.length === 0 || !state.subject || !state.message}
                                className="gap-2"
                              >
                                <IconSend className="h-4 w-4" />
                                {state.isSending ? "Sending..." : state.scheduleTime ? "Schedule Send" : "Send"}
                              </Button>
                              <Button type="button" variant="outline" className="gap-2">
                                <IconEye className="h-4 w-4" />
                                Preview
                              </Button>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Press Ctrl+Enter to send
                            </div>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="templates">
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Email Templates</h3>
                            <Button variant="outline" size="sm">
                              <IconPlus className="h-4 w-4 mr-2" />
                              Create Template
                            </Button>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {EmailTemplateService.getAllTemplates().map((template) => (
                              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                      <h4 className="font-medium">{template.name}</h4>
                                      {template.isDefault && (
                                        <Badge variant="secondary" className="text-xs">Default</Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                      {template.subject}
                                    </p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {template.body.slice(0, 100)}...
                                    </p>
                                    <Button 
                                      size="sm" 
                                      className="w-full mt-2"
                                      onClick={() => actions.loadTemplate(template)}
                                    >
                                      Use Template
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Link Dialog */}
                {showLinkDialog && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Insert Link</h3>
                          <div className="space-y-2">
                            <Label htmlFor="link-url">URL</Label>
                            <Input
                              id="link-url"
                              value={linkUrl}
                              onChange={(e) => setLinkUrl(e.target.value)}
                              placeholder="https://example.com"
                              autoFocus
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="link-text">Link Text (optional)</Label>
                            <Input
                              id="link-text"
                              value={linkText}
                              onChange={(e) => setLinkText(e.target.value)}
                              placeholder="Link description"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleInsertLink} disabled={!linkUrl}>
                              Insert Link
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}