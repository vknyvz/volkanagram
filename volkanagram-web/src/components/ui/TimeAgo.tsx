import {formatDistanceToNow} from 'date-fns'

export default function TimeAgo({date}: { date: string }) {
  const timeAgo = formatDistanceToNow(new Date(date), {addSuffix: true})
    .replace('about ', '')
    .replace('less than a minute ago', 'just now')
    .replace(' minute ago', 'm')
    .replace(' minutes ago', 'm')
    .replace(' hour ago', 'h')
    .replace(' hours ago', 'h')
    .replace(' day ago', 'd')
    .replace(' days ago', 'd')
    .replace(' month ago', 'mo')
    .replace(' months ago', 'mo')
    .replace(' year ago', 'y')
    .replace(' years ago', 'y')

  return <span>{timeAgo}</span>
}