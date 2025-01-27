interface PrimaryButtonProps {
  label: string
  onClick: () => void
  href?: string
  logo?: React.ReactNode;
  disabled?: boolean;
}

export const PrimaryButton = ({ label, onClick, logo, href, disabled }: PrimaryButtonProps) => {
  return (
    <div className={`font-bold ${disabled ? 'bg-gray-500' : 'bg-red-500'} border border-black rounded-full ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:shadow-none shadow-[-3px_3px_0_0] hover:translate-y-2 hover:-translate-x-2 duration-300'}`}>
      <button onClick={disabled ? undefined : onClick} disabled={disabled} className={`${disabled ? "cursor-not-allowed" : ""} focus:outline-none`}>
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