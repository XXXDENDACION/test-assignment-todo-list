import { gql } from 'graphql-request';
import { marked } from 'marked';
import { hasuraAnonymousClient } from '@/shared/api/hasura/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface ToSDocument {
  id: string;
  version: string;
  content: string;
  published_at: string;
}

interface GetToSResponse {
  tos_documents: ToSDocument[];
}

const GET_LATEST_TOS = gql`
  query GetLatestToS {
    tos_documents(order_by: { published_at: desc }, limit: 1) {
      id
      version
      content
      published_at
    }
  }
`;

// Fallback ToS content when Hasura is not available
const fallbackToS: ToSDocument = {
  id: 'fallback',
  version: '1.0',
  content: `# Terms of Service

## 1. Acceptance of Terms

By accessing and using this Task Management application, you accept and agree to be bound by the terms and provision of this agreement.

## 2. Description of Service

The Service provides task management functionality allowing users to create, read, update, and delete tasks.

## 3. User Account

You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

## 4. User Conduct

You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or impair the Service.

## 5. Privacy Policy

Your privacy is important to us. Your data will be stored securely and will not be shared with third parties.

## 6. Modifications to Service

We reserve the right to modify or discontinue the Service at any time without notice.

## 7. Limitation of Liability

The Service is provided "as is" without warranties of any kind.

## 8. Contact Information

For questions about these Terms, please contact support@example.com.`,
  published_at: new Date().toISOString(),
};

async function getLatestToS(): Promise<ToSDocument> {
  try {
    const data = await hasuraAnonymousClient.request<GetToSResponse>(GET_LATEST_TOS);
    return data.tos_documents[0] || fallbackToS;
  } catch (error) {
    console.error('Error fetching ToS, using fallback:', error);
    return fallbackToS;
  }
}

// Force dynamic rendering - fetch on each request (SSR)
export const dynamic = 'force-dynamic';

export default async function TermsPage() {
  const tos = await getLatestToS();
  const publishedDate = new Date(tos.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Parse markdown content using marked library
  const htmlContent = await marked(tos.content);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle>Terms of Service</CardTitle>
              <div className="text-sm text-muted-foreground">
                <span>Version {tos.version}</span>
                <span className="mx-2">|</span>
                <span>Last updated: {publishedDate}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent
            className="prose prose-sm sm:prose dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            This page is rendered server-side on each request to always show the latest Terms of
            Service.
          </p>
        </div>
    </main>
  );
}
