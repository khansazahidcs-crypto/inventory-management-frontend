import { useEffect, useState } from "react";
import { settingService } from "../api/services";

// Module-level cache so we only hit /settings once per page load,
// no matter how many components use this hook.
let cachedSymbol = null;

export default function useCurrencySymbol() {
  const [symbol, setSymbol] = useState(cachedSymbol ?? "$");

  useEffect(() => {
    if (cachedSymbol) {
      return;
    }

    settingService
      .list()
      .then(({ data }) => {
        const allSettings = Object.values(data.data || {}).flat();
        const currencySetting = allSettings.find((s) => s.key === "currency_symbol");

        if (currencySetting?.value) {
          cachedSymbol = currencySetting.value;
          setSymbol(currencySetting.value);
        }
      })
      .catch(() => {
        // If settings can't be loaded (e.g. not authenticated yet),
        // just keep the "$" default rather than breaking price displays.
      });
  }, []);

  return symbol;
}
