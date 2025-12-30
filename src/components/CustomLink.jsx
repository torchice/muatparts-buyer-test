import Link from 'next/link'
export const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_ASSET_REVERSE || '';
}
const createUrl = (path) => {
    if(path.indexOf("https://") == 0) return path;
    return `${getBaseUrl()}${path}`;
}
export default function CustomLink({ href, children,className, ...props }) {
  const finalHref = createUrl(href)  
  return (
    <Link href={finalHref} className={className} {...props}>
      {children}
    </Link>
  )
}