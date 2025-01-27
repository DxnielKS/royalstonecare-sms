interface PrimaryButtonProps {
  label: string
  onClick: () => void
  href?: string
  logo?: React.ReactNode;
}

export const PrimaryButton = ({ label, onClick, logo, href }: PrimaryButtonProps) => {
  return (
    <div className="font-bold bg-blue-500 border border-black rounded-full hover:shadow-none shadow-[-3px_3px_0_0] hover:translate-y-2 hover:-translate-x-2 duration-300">
      <button onClick={onClick}>
        <a href={href}>
          <div className="flex gap-x-4 items-center justify-center p-4">
            {logo}
            <span>{label}</span>
          </div>
        </a>
      </button>
    </div>
  )
}