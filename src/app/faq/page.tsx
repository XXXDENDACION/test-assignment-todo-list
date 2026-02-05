import { gql } from 'graphql-request';
import { hasuraAnonymousClient } from '@/shared/api/hasura/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

interface GetFAQResponse {
  faq_items: FAQItem[];
}

const GET_FAQ_ITEMS = gql`
  query GetFAQItems {
    faq_items(order_by: { order_index: asc }) {
      id
      question
      answer
      order_index
    }
  }
`;

// Static data fallback for when Hasura is not available
const fallbackFAQItems: FAQItem[] = [
  {
    id: '1',
    question: 'How do I create a new task?',
    answer: 'Click the "New Task" button on the task list page, fill in the title and description, then click "Create Task".',
    order_index: 1,
  },
  {
    id: '2',
    question: 'Can I edit my tasks?',
    answer: 'Yes! Click on the edit icon next to any task to modify its title, description, or completion status.',
    order_index: 2,
  },
  {
    id: '3',
    question: 'How do I delete a task?',
    answer: 'Click the delete icon next to the task you want to remove. You will be asked to confirm the deletion.',
    order_index: 3,
  },
  {
    id: '4',
    question: 'Is my data secure?',
    answer: 'Yes, your data is stored securely and each user can only access their own tasks.',
    order_index: 4,
  },
  {
    id: '5',
    question: 'Can I use this on my phone?',
    answer: 'Absolutely! The application is fully responsive and works great on mobile devices.',
    order_index: 5,
  },
  {
    id: '6',
    question: 'How do I log out?',
    answer: 'Click on your profile icon in the navigation bar and select "Sign Out".',
    order_index: 6,
  },
];

async function getFAQItems(): Promise<FAQItem[]> {
  try {
    const data = await hasuraAnonymousClient.request<GetFAQResponse>(GET_FAQ_ITEMS);
    return data.faq_items;
  } catch (error) {
    console.error('Error fetching FAQ items, using fallback:', error);
    return fallbackFAQItems;
  }
}

// Force static generation at build time (pure SSG - no revalidation)
export const dynamic = 'force-static';

export default async function FAQPage() {
  const faqItems = await getFAQItems();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Find answers to common questions about using the Task Manager.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span>{item.question}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-14">
                <p className="text-muted-foreground">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground">
              Still have questions? Contact us at{' '}
              <a href="mailto:support@example.com" className="text-primary hover:underline">
                support@example.com
              </a>
            </p>
          </CardContent>
        </Card>
    </main>
  );
}
