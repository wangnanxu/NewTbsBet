using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace NewTbsBetTwo
{
    public class ConfigSingleton
    {
        private static ConfigSingleton instance = new ConfigSingleton();
        private ConfigSingleton() { }
        public static ConfigSingleton CreateInstance()
        {
            return instance;
        }

        public T GetAppConfig<T>(string key)
        {
            if (string.IsNullOrEmpty(ConfigurationManager.AppSettings[key])) return default(T);
            T value = (T)Convert.ChangeType(ConfigurationManager.AppSettings[key], typeof(T));
            return value;
        }
    }
}