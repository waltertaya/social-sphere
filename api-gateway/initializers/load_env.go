package initializers

import (
	"log"
	"strings"

	"github.com/spf13/viper"
)

func InitConfig() {
	viper.SetConfigFile("./config/config.yaml")

	viper.AutomaticEnv()

	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	err := viper.ReadInConfig()

	if err != nil {
		log.Fatalf("Error reading config file %v", err)
	}
}
