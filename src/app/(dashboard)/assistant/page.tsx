"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ChatInterface } from "@/components/assistant/ChatInterface";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n/translations";

export default function AssistantPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={t(language, "assistant")}
        subtitle="Ask about crops, AP schemes, market prices — English or Telugu"
      />
      <ChatInterface />
    </div>
  );
}
