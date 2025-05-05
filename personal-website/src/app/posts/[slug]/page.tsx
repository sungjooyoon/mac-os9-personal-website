import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// Define the getStaticParams function to generate static paths
export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/posts'));
  return files.map((fileName) => ({
    slug: fileName.replace(/\.md$/, ''),
  }));
}

// Define the component props
type Props = {
  params: {
    slug: string;
  };
};

// Define the page component
export default async function Post({ params }: Props) {
  const { slug } = params;
  const fullPath = path.join(process.cwd(), 'src/posts', `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-blue-900 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Beamer-Style Personal Website</h1>
          <div className="mt-2 text-blue-100">An academic-style personal website with blog functionality</div>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row flex-grow container mx-auto my-8">
        {/* Sidebar - like Beamer navigation */}
        <div className="w-full md:w-64 bg-white shadow-md p-6 rounded-lg mb-6 md:mb-0 md:mr-6">
          <nav>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-blue-900 border-b border-blue-900 pb-2 mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li className="hover:bg-blue-50 px-3 py-2 rounded"><a href="/" className="block">Home</a></li>
                <li className="bg-blue-100 text-blue-900 px-3 py-2 rounded font-medium">Blog</li>
                <li className="hover:bg-blue-50 px-3 py-2 rounded"><a href="/#about" className="block">About</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-blue-900 border-b border-blue-900 pb-2 mb-4">Latest Posts</h3>
              <ul className="space-y-2">
                <li className="px-3 py-1">
                  <a href="/posts/beamer-style" className={`text-blue-700 hover:underline ${slug === 'beamer-style' ? 'font-bold' : ''}`}>
                    Creating a Beamer-Style Website
                  </a>
                </li>
                <li className="px-3 py-1">
                  <a href="/posts/sample-post" className={`text-blue-700 hover:underline ${slug === 'sample-post' ? 'font-bold' : ''}`}>
                    Sample Blog Post
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        
        {/* Main content */}
        <main className="flex-grow bg-white shadow-md p-6 rounded-lg">
          <article>
            <h1 className="text-3xl font-bold mb-6 text-blue-900 border-b border-blue-900 pb-2">{matterResult.data.title}</h1>
            <div className="text-gray-600 mb-6">Posted on {matterResult.data.date}</div>
            
            <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            
            <div className="mt-8 pt-4 border-t border-gray-200">
              <a href="/" className="text-blue-700 hover:underline">← Back to home</a>
            </div>
          </article>
        </main>
      </div>
      
      <footer className="bg-blue-900 text-white p-4 text-center mt-8">
        <p>© 2023 My Personal Website</p>
      </footer>
    </div>
  );
}
 