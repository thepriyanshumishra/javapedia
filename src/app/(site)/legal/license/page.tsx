import Image from "next/image";

export default function LicensePage(): React.ReactElement {
  return (
    <main className="container max-w-4xl pt-20 max-sm:px-0 md:pb-12">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-white">
          Licensing
        </h1>
        <p className="mb-6 text-lg text-neutral-600 dark:text-neutral-400">
          Javapedia uses a dual licensing model for different types of content.
        </p>
        <div className="text-sm text-neutral-500 dark:text-neutral-500">
          <p>
            <strong>Adopted:</strong> July 29, 2025
          </p>
          <p>
            <strong>Last Updated:</strong> October 16, 2025
          </p>
        </div>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>MIT License Overview</h2>
        <p>
          Javapedia is licensed under the <strong>MIT License</strong>, a
          permissive free software license that allows for reuse within
          proprietary software provided that all copies of the licensed software
          include a copy of the MIT License terms and the copyright notice.
        </p>

        <div className="mb-8 rounded-lg bg-neutral-50 p-6 dark:bg-neutral-900">
          <h3 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white">
            MIT License
          </h3>
          <div className="mb-4 flex items-center gap-4">
            <Image
              src="https://img.shields.io/badge/License-MIT-yellow.svg"
              alt="MIT License"
              className="h-6 w-auto"
              width={100}
              height={24}
              unoptimized
            />
            <span className="text-lg font-medium">The MIT License</span>
          </div>
          <p className="mb-4">
            The entire project (code and content) is licensed under the MIT
            License, which grants you the permission to:
          </p>
          <ul className="mb-4">
            <li>Use the software for any purpose</li>
            <li>Modify the source code</li>
            <li>Distribute copies</li>
            <li>Merge, publish, distribute, sublicense, and/or sell copies</li>
          </ul>
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
            The only condition is that you must include the original copyright
            notice and license permission in all copies.
          </p>
          <a
            href="https://opensource.org/licenses/MIT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View Full MIT License
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        <h2>License File</h2>
        <p>You can find the complete license text in our repository:</p>
        <ul>
          <li>
            <a
              href="https://github.com/thepriyanshumishra/javapedia/blob/main/LICENSE"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Full MIT License Text (LICENSE)
            </a>
          </li>
        </ul>

        <h2>Contributing</h2>
        <p>When contributing to Javapedia:</p>
        <ul>
          <li>
            <strong>All contributions</strong> (code and content) will be
            licensed under the MIT License
          </li>
          <li>
            You agree to allow your contributions to be distributed under these
            terms
          </li>
        </ul>

        <h2>Copyright Notice</h2>
        <p className="rounded-lg bg-neutral-100 p-4 text-center dark:bg-neutral-800">
          <strong>Copyright © 2025 Priyanshu Mishra</strong>
          <br />
          <a
            href="https://github.com/thepriyanshumishra"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            github.com/thepriyanshumishra
          </a>
        </p>

        <h2>Contact</h2>
        <p>
          For licensing inquiries or questions about using Javapedia content,
          please contact:
        </p>
        <ul>
          <li>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:thedarkpcm@gmail.com"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              thedarkpcm@gmail.com
            </a>
          </li>
          <li>
            <strong>GitHub:</strong>{" "}
            <a
              href="https://github.com/thepriyanshumishra/javapedia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              thepriyanshumishra/javapedia
            </a>
          </li>
        </ul>

        <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 py-0 dark:border-yellow-800 dark:bg-yellow-900/20">
          <h3 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-200">
            Important Note
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            This licensing page is for informational purposes. For legal advice
            or specific use cases, please consult with a qualified legal
            professional. The licenses described here apply to the original
            Javapedia project content only.
          </p>
        </div>
      </div>
    </main>
  );
}
