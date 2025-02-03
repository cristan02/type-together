import Link from "next/link";
import { PhoneCall, Mail } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen p-8 pb-0 max-w-screen-2xl flex flex-col justify-center items-center mb-28">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">
          Getting Started with Type Together Text Editor
        </h1>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Features</h2>
          <ul className="list-disc list-inside">
            <li>Rich Text Editing</li>
            <li>Insert Media</li>
            <li>Lists and Indentation</li>
            <li>Code Blocks</li>
            <li>History</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">How to Use</h2>
          <ol className="list-decimal list-inside">
            <li className="mb-2">
              <strong>Open the Editor:</strong> When you open the application,
              you will see the main interface with a sidebar and the text
              editor.
            </li>
            <li className="mb-2">
              <strong>Create a New Document:</strong> Click on the
              &quot;New&quot; button in the sidebar to open a blank document in
              the editor.
            </li>
            <li className="mb-2">
              <strong>Edit Your Document:</strong> Use the toolbar at the top of
              the editor to format your text.
            </li>
            <li className="mb-2">
              <strong>Save Your Document:</strong> Your document is
              automatically saved as you type. You can also manually save your
              document by clicking the &quot;Save&quot; button in the toolbar.
            </li>
            <li className="mb-2">
              <strong>Access Document History:</strong> Use the undo and redo
              buttons in the toolbar to navigate through your document&apos;s
              history.
            </li>
            <li className="mb-2">
              <strong>Collaborate with Others:</strong> Invite others to
              collaborate on your document by clicking the &quot;Invite&quot;
              button in the toolbar.
            </li>
          </ol>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Keyboard Shortcuts</h2>
          <ul className="list-disc list-inside">
            <li>
              <strong>Bold:</strong> Ctrl + B
            </li>
            <li>
              <strong>Italic:</strong> Ctrl + I
            </li>
            <li>
              <strong>Underline:</strong> Ctrl + U
            </li>
            <li>
              <strong>Undo:</strong> Ctrl + Z
            </li>
            <li>
              <strong>Redo:</strong> Ctrl + Y
            </li>
            <li>
              <strong>Save:</strong> Ctrl + S
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">Support</h2>
          <p>
            If you need any help or have any questions, please contact our us.
            We are available 24/7 to assist you.
          </p>

          <div className=" flex gap-2 items-center px-4">
            <span className=" font-semibold tracking-wide">
              Ashbourn D&apos;Cunha
            </span>

            <Link href="tel:+918007655276">
              <div className=" p-2 bg-secondary rounded-full flex justify-center items-center hover:bg-gray-200 hover:shadow-sm">
                <PhoneCall className=" ml-auto size-5" />
              </div>
            </Link>

            <Link href="mailto:ashbourn.d''cunha@mitwpu.edu.in">
              <div className=" p-2 bg-secondary rounded-full flex justify-center items-center hover:bg-gray-200 hover:shadow-sm">
                <Mail className=" ml-auto size-5" />
              </div>
            </Link>
          </div>

          <div className=" flex gap-2 items-center px-4">
            <span className=" font-semibold tracking-wide">Manav Adwani</span>

            <Link href="tel:+919512278326">
              <div className=" p-2 bg-secondary rounded-full flex justify-center items-center hover:bg-gray-200 hover:shadow-sm">
                <PhoneCall className=" ml-auto size-5" />
              </div>
            </Link>

            <Link href="mailto:manav.adwani@mitwpu.edu.in">
              <div className=" p-2 bg-secondary rounded-full flex justify-center items-center hover:bg-gray-200 hover:shadow-sm">
                <Mail className=" ml-auto size-5" />
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
