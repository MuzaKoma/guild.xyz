import { Icon } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useUser from "components/[guild]/hooks/useUser"
import Script from "next/script"
import platforms from "platforms"
import { ParsedUrlQuery } from "querystring"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { PlatformName } from "types"
import useConnectPlatform from "../hooks/useConnectPlatform"
import ConnectAccount from "./ConnectAccount"

type Props = {
  platform: PlatformName
  query: ParsedUrlQuery
}

const ConnectPlatform = ({ platform, query }: Props) => {
  const { isActive } = useWeb3React()
  const { platformUsers, isLoading: isLoadingUser } = useUser()
  const { onConnect, isLoading, loadingText, authData, response } =
    useConnectPlatform(platform)

  const platformFromDb = platformUsers?.find(
    (platformAccount) => platformAccount.platformName === platform
  )?.username
  const platformFromQueryParam =
    query.platform === platform && typeof query.hash === "string"

  const { setValue } = useFormContext()

  useEffect(() => {
    if (platformFromQueryParam)
      setValue(`platforms.${platform}`, { hash: query.hash as string })
  }, [platformFromQueryParam])

  useEffect(() => {
    if (!isActive && authData) setValue(`platforms.${platform}`, { authData })
  }, [isActive, authData])

  useEffect(() => {
    if (platformFromDb) setValue(`platforms.${platform}`, null)
  }, [platformFromDb])

  return (
    <ConnectAccount
      account={platforms[platform].name}
      icon={<Icon as={platforms[platform].icon} />}
      colorScheme={platforms[platform].colorScheme as string}
      isConnected={
        platformFromDb ||
        response?.platformUserId ||
        (platformFromQueryParam && "hidden") ||
        (authData && "hidden")
      }
      isLoading={isLoading || (!platformUsers && isLoadingUser)}
      onClick={onConnect}
      {...{ loadingText }}
      isDisabled={platform === "TWITTER" && !isActive && "Connect wallet first"}
    >
      {platform === "TELEGRAM" && (
        <Script
          strategy="lazyOnload"
          src="https://telegram.org/js/telegram-widget.js?19"
        />
      )}
    </ConnectAccount>
  )
}

export default ConnectPlatform
