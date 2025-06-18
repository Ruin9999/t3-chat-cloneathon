import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";

import { CustomCodeBlock } from "./custom_code_block";

export function CustomReactMarkdown({ children } : { children : string }) {
  return <ReactMarkdown
    remarkPlugins={[remarkBreaks]}
    className="prose prose-sm dark:prose-invert max-w-none space-y-2"
    components={{
      code({ node, inline, className, children, ...props }) {
        return <CustomCodeBlock className={className} {...props}>
          {children}
        </CustomCodeBlock>
      },

    }}
  >
    {children}
  </ReactMarkdown>
}