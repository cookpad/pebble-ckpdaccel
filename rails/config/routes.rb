Rails.application.routes.draw do
  post "/", to: "accelerometer_data_points#create"
end
