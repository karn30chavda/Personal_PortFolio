
import { getContactSubmissions } from '@/lib/contact-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export default async function DashboardMessagesPage() {
  const messages = await getContactSubmissions();

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-8 space-y-10">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Contact Form Messages
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm lg:text-base">
          Here are the messages submitted through your portfolio's contact form.
        </p>
      </div>

      {messages.length === 0 ? (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                You have no messages yet.
            </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <Card key={message.id} className="p-0 md:bg-white/70 md:dark:bg-gray-900/50 md:backdrop-blur-md md:rounded-2xl md:border md:border-gray-200 md:dark:border-gray-800 md:shadow-sm md:hover:shadow-md md:transition-shadow">
              <CardHeader>
                <div className='flex justify-between items-start'>
                    <div>
                        <CardTitle className="text-lg">{message.name}</CardTitle>
                        <CardDescription>
                            <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                                {message.email}
                            </a>
                        </CardDescription>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0">
                        {formatDistanceToNow(new Date(message.submittedAt), { addSuffix: true })}
                    </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
